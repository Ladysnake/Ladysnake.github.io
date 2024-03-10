module Ladysnake
  ##
  # A tag that can generate HTML markup for a section split in multiple toggleable tabs
  #
  # Usage:
  #  "{%- tabbed my_key -%}
  #  [- Tab 1 -]
  #  Tab 1 content
  #
  #  [- Tab 2 -]
  #  Tab 2 content
  #
  #  [- Tab 3 -]
  #  Tab 3 content
  #  {%- endtabbed %}"
  class TabbedTag < Liquid::Block
    ##
    # Parses a markup string into pairs of [name, content]
    #
    # "[- Tab 1 -]\nContent" => [["Tab 1", "Content"], ...]
    def self.parse_tabs(markup)
      markup.scan(/^\[-\s*(.*?)\s*-\]\n(.*?)(?=\n\[-|\Z)/m)
    end

    def initialize(tag_name, markup, options)
      super
      @input = markup
    end

    def render(context)
      body = super
      tabs = TabbedTag.parse_tabs(body)
      tab_names, tab_contents = tabs.transpose
      context["key"] = @input
      context["tab_names"] = tab_names
      context["tab_contents"] = tab_contents
      Liquid::Template.parse("{% include tabbed.liquid key=key tab_names=tab_names tabs=tab_contents %}").render(context)
    end
  end
end

Liquid::Template.register_tag('tabbed', Ladysnake::TabbedTag)
