module Ladysnake
  class TestTag < Liquid::Block
    def render(context)

      puts @markup
      puts "Hello"
      puts super

      dependencies = Hash[@markup.scan(/\[(\w+):(\w+)\]/)]
      puts dependencies

      # Extract the block content from the @markup variable
      content = super

      # Do something with the parameters and content...

      # Return the rendered output
      "Rendered output"
    end
  end
end
Liquid::Template.register_tag('test_tag', Ladysnake::TestTag)
