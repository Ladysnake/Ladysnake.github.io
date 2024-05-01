require 'open-uri'
require 'json'

module Ladysnake
  class Ingredient
    attr_reader :item

    def initialize(data)
      @item = data["item"]
    end

    EMPTY = Ingredient.new(Hash["item", "minecraft:air"])

    def empty?
      @item == "minecraft:air"
    end

    def to_s
      @item
    end
  end

  class ShapedRecipe
    attr_reader :result, :ingredients, :width, :height

    def initialize(result, ingredients, width, height)
      @result = result
      @ingredients = ingredients
      @width = width
      @height = height
    end

    def self.parse(data)
      pattern = data["pattern"]
      height = pattern.size

      # Check preconditions
      if height > 3
        raise "Invalid pattern: too many rows, 3 is maximum"
      elsif pattern.empty?
        raise "Invalid pattern: empty pattern not allowed"
      end

      width = pattern[0].length
      pattern.each { |row|
        if row.length > 3
          raise "Invalid pattern: too many columns, 3 is maximum"
        elsif row.length != width
          raise "Invalid pattern: each row must be the same width"
        end
      }

      # Parse the pattern and key into a list of ingredients
      ingredients = Array.new(width * height) { Ingredient::EMPTY }
      keys = data["key"]
      (0...height).each { |y|
        row = pattern[y]
        (0...row.length).each { |x|
          char = row[x]
          ingredient = keys[char] ? Ingredient.new(keys[char]) : Ingredient::EMPTY
          if ingredient.empty? && char != ' '
            raise "Pattern references symbol '#{char}' but it's not defined in the key"
          end
          ingredients[x + width * y] = ingredient
        }
      }

      # Check postconditions
      unused_symbols = keys.keys - pattern.join.chars
      unless unused_symbols.empty?
        raise "Key defines symbols that aren't used in pattern: #{unused_symbols.join(", ")}"
      end

      ShapedRecipe.new(data["result"], ingredients, width, height)
    end

    def to_3x3_grid
      if @width == 3
        if @height == 3
          # Nothing to do here
          return @ingredients
        else
          # Missing ingredients must be at the end of the list, so we can just append them
          return @ingredients + [Ingredient::EMPTY] * (9 - ingredients.size)
        end
      else
        # We have missing ingredients in the middle of the array - need to reconstruct the list as a 3x3
        padded = Array.new(9) { Ingredient::EMPTY }
        (0...@height).each do |row|
          (0...@width).each do |col|
            padded[row * 3 + col] = @ingredients[row * @width + col]
          end
        end
      end
    end

    def to_s
      "ShapedRecipe[#{@width}x#{@height}]"
    end
  end

  class ShapelessRecipe
    attr_reader :result, :ingredients

    def initialize(result, ingredients)
      @result = result
      @ingredients = ingredients
    end

    def self.parse(data)
      ingredients = data["ingredients"].map do |i|
        Ingredient.new(i)
      end
      ShapelessRecipe.new(data["result"], ingredients)
    end

    def to_3x3_grid
      if @ingredients.size == 9
        @ingredients
      else
        @ingredients + [Ingredient::EMPTY] * (9 - @ingredients.size)
      end
    end

    def to_s
      "ShapelessRecipe[#{@ingredients.join(',')}=>#{result}]"
    end
  end

  class RecipeTag < Liquid::Tag
    def self.cache
      @cache ||= Jekyll::Cache.new("Ladysnake::RecipeTag")
    end

    def cache
      self.class.cache
    end

    def initialize(tag_name, markup, tokens)
      super
      @recipe_id = Liquid::Expression.parse(markup.strip)
    end

    def render(context)
      site = context.registers[:site]
      page = context.registers[:page]
      recipe_namespace, recipe_path = context.evaluate(@recipe_id).split(':')
      recipe_root = (page["resource_roots"] || site.data["mods"]["resource_roots"])[recipe_namespace]

      unless recipe_root
        puts "Failed to load recipe '#{recipe_namespace}:#{recipe_path}': no known resource root for namespace #{recipe_namespace}"
        return "<em>Failed to load recipe #{recipe_path}</em>"
      end

      url = "#{recipe_root}/data/#{recipe_namespace}/recipes/#{recipe_path}.json"

      begin
        recipe = cache.getset(url) do
          json_data = URI.open(url) do |io|
            io.read
          end

          data = JSON.parse(json_data)

          type = data["type"]

          if type == "minecraft:crafting_shaped"
            ShapedRecipe.parse(data)
          elsif type == "minecraft:crafting_shapeless"
            ShapelessRecipe.parse(data)
          end
        end
        context["slots"] = recipe.to_3x3_grid.map { |i|
          if i.empty?
            nil
          else
            i.item
          end }
        context["result"] = recipe.result["item"]
        context["count"] = recipe.result["count"]
        context["shaped"] = recipe.class == ShapedRecipe
        Liquid::Template.parse("{% include mc/crafting.liquid slots=slots result=result count=count shaped=shaped %}").render(context)
      rescue StandardError => e
        puts "Error loading JSON data: #{e.message}"
        puts "Failed to load recipe from #{url}"
        "<em>Failed to load recipe #{recipe_path}</em>"
      end
    end
  end
end
Liquid::Template.register_tag('recipe', Ladysnake::RecipeTag)
