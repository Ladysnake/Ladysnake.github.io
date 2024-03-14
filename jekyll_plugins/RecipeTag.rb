require 'open-uri'
require 'json'

module Ladysnake
  class Ingredient
    def initialize(data)
      @item = data["item"]
    end

    EMPTY = Ingredient.new(Hash["item", "minecraft:air"])

    def item
      @item
    end

    def empty?
      @item == "minecraft:air"
    end

    def to_s
      @item
    end
  end

  class ShapedRecipe
    def initialize(result, ingredients, width, height)
      @result = result
      @ingredients = ingredients
      @width = width
      @height = height
    end

    def result
      @result
    end

    def ingredients
      @ingredients
    end

    def pad_ingredients
      if @width == 3
        if @height == 3
          # Nothing do do here
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

    def width
      @width
    end

    def height
      @height
    end

    def to_s
      "Recipe[#{@width}x#{@height}]"
    end
  end

  class RecipeTag < Liquid::Tag
    def self.cache
      @cache ||= Jekyll::Cache.new("Ladysnake::RecipeTag")
    end

    def cache
      self.class.cache
    end

    def render(context)
      recipe_root = context.registers[:page]["recipe_root"]
      recipe_path = @markup.strip
      url = recipe_root + recipe_path

      recipe = cache.getset(url) do
        begin
          json_data = URI.open(url) do |io|
            io.read
          end

          data = JSON.parse(json_data)

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
        rescue StandardError => e
          puts "Error loading JSON data: #{e.message}"
          nil
        end
      end

      # Check if the data was loaded successfully
      if recipe
        context["slots"] = recipe.pad_ingredients.map { |i| i.item }
        context["result"] = recipe.result["item"]
        context["count"] = recipe.result["count"]
        Liquid::Template.parse("{% include mc/crafting.liquid slots=slots result=result count=count %}").render(context)
      else
        puts "Failed to load recipe from #{url}"
        "<em>Failed to load recipe #{recipe_path}</em>"
      end
    end
  end
end
Liquid::Template.register_tag('recipe', Ladysnake::RecipeTag)