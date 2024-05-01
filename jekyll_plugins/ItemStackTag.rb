require 'net/http'
require 'uri'

module Ladysnake
  class Lang
    # Lang files are susceptible to be called by a lot of things, so make a dedicated cache for them
    def self.cache
      @cache ||= Jekyll::Cache.new("Ladysnake::Lang")
    end

    def self.fetch(lang_url)
      cache.getset(lang_url) do
        uri = URI.parse(lang_url)
        response = Net::HTTP.get_response(uri)

        if response.is_a?(Net::HTTPSuccess)
          JSON.parse(response.body)
        else
          raise "Failed to fetch language data: #{response.code} #{response.message}"
        end
      end
    end
  end

  def self.parse_args(markup)
    args = {}
    markup.scan(/(\w+)\s*\=\s*(#{Liquid::QuotedFragment})/o) do |key, value|
      args[key] = Liquid::Expression.parse(value)
    end
    args
  end

  class ItemStackTag < Liquid::Tag
    def self.cache
      @cache ||= Jekyll::Cache.new("Ladysnake::ItemStackTag")
    end

    def cache
      self.class.cache
    end

    def initialize(tag_name, markup, tokens)
      super
      args = Ladysnake.parse_args(markup)
      @item_name = args['item']
      @alt_prefix = args['alt_prefix']
      @count = args['count']
    end

    def render(context)
      site = context.registers[:site]
      page = context.registers[:page]
      data = site.data["minecraft"]["items"]
      item_name = context.evaluate(@item_name)
      alt_prefix = context.evaluate(@alt_prefix) || ""
      count = context.evaluate(@count) || 1
      item = data[item_name] || default_data(page["resource_roots"] || site.data["mods"]["resource_roots"], item_name)
      if item.nil?
        item = data["MISSING"]
        missing = true
      end

      "<span class=\"invslot-item invslot-item-image\" data-minetip-title=\"#{item["name"]}\"#{" data-minetip-description=\"#{item_name}\"" if missing}#{' tabindex=0' unless item["link"]}>
      #{'<a href="' + item["link"] + '">' if item["link"]}
      <img alt=\"#{alt_prefix}#{item["name"]}\" src=\"#{item["icon"]}\" decoding=\"async\" loading=\"lazy\" width=\"32\" height=\"32\">
      #{'</a>' if item["link"]}
      #{'<span class="invslot-stacksize">' + count.to_s + '</span>' if count > 1}
      </span>"
    end

    private

    def default_mod_data(resource_root, namespace, path)
      model = fetch_model_data(resource_root, namespace, path)
      name = fetch_localized_name(resource_root, namespace, path)
      {
        'icon' => model,
        'name' => name
      }
    end

    def fetch_model_data(resource_root_url, namespace, path)
      json_url = "#{resource_root_url}/assets/#{namespace}/models/item/#{path}.json"

      uri = URI.parse(json_url)
      response = Net::HTTP.get_response(uri)

      if response.is_a?(Net::HTTPSuccess)
        model_data = JSON.parse(response.body)
        if model_data["parent"].end_with? "item/generated"
          texture_namespace, texture_path = model_data["textures"]["layer0"].split(':')
          if texture_namespace == namespace
            "#{resource_root_url}/assets/#{texture_namespace}/textures/#{texture_path}.png"
          else
            raise "Texture in external namespace '#{texture_namespace}'"
          end
        else
          raise "Unsupported model parent '#{model_data["parent"]}' (only basic 2D item models are supported)"
        end
      else
        raise "Failed to fetch JSON model data at #{json_url}: #{response.code} #{response.message}"
      end
    end

    def fetch_localized_name(resource_root_url, namespace, path)
      lang_url = "#{resource_root_url}/assets/#{namespace}/lang/en_us.json"

      lang_data = Ladysnake::Lang.fetch(lang_url)

      localized_name = lang_data["item.#{namespace}.#{path}"]

      # If the item name was not found, try the block equivalent
      if localized_name.nil?
        localized_name = lang_data["block.#{namespace}.#{path}"]
      end

      # If neither the item nor the block name was found, raise an error
      if localized_name.nil?
        raise "Localized name not found in #{lang_url}"
      end

      localized_name
    end

    def default_minecraft_data(item_name)
      wiki_name = item_name.gsub(/(_)([a-z])/) { $1 + $2.upcase }.gsub(/^./) { $&.upcase }
      url = "https://minecraft.wiki/w/#{wiki_name}"
      uri = URI.parse(url)

      begin
        response = Net::HTTP.get_response(uri)

        if response.is_a?(Net::HTTPSuccess)
          icon_url = "https://minecraft.wiki/images/Invicon_#{wiki_name}.png"
          icon_uri = URI.parse(icon_url)
          icon_response = Net::HTTP.get_response(icon_uri)

          if icon_response.is_a?(Net::HTTPSuccess)
            return {
              "name" => wiki_name.gsub('_', ' '),
              "link" => url,
              "icon" => icon_url
            }
          else
            raise "Wiki Icon request at #{icon_url} failed with status code #{icon_response.code}"
          end
        else
          raise "Wiki page request at #{url} failed with status code #{response.code}"
        end
      rescue StandardError => e
        raise "#{e.class} while fetching Wiki pages: #{e.message}"
      end
    end

    def default_data(resource_roots, item_name)
      cache.getset(item_name) do
        namespace, path = item_name.split(':')
        if namespace == "minecraft"
          default_minecraft_data(path)
        elsif resource_roots.key? namespace
          default_mod_data(resource_roots[namespace], namespace, path)
        else
          nil
        end
      end
    rescue StandardError => e
      puts "Error loading default data for item '#{item_name}': #{e.message}"
      nil
    end
  end
end

Liquid::Template.register_tag('itemstack', Ladysnake::ItemStackTag)
