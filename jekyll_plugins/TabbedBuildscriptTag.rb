module Ladysnake
  ##
  # A tag that can generate HTML markup for a Gradle buildscript with each tab containing
  # instructions for a specific format
  #
  # Usage:
  #  "{%- buildscript dependencies={key1: value1, key2: value2} -%}
  #  [build.gradle]
  #  Instructions for Groovy build.gradle
  #
  #  [build.gradle.kts]
  #  Instructions for Kotlin build.gradle.kts
  #
  #  [catalogue]
  #  Instructions for `libs.versions.toml`
  #  {%- endbuildscript -%}"
  class TabbedBuildScriptTag < Liquid::Block
    def initialize(tag_name, text, tokens)
      super
      @input = text
    end

    def render(context)
      body = super
      mods = Hash[@input.scan(/\[(\w+):(\w+)\]/)]
      tabs = Hash[TabbedTag.parse_tabs(body)]

      context["groovy"] = tabs["groovy"]
      context["kts"] = tabs["kts"]
      context["catalogue"] = tabs["catalogue"]
      context["mods"] = mods

      include = "{% include tabbed_buildscript.liquid mods=mods groovy=groovy kts=kts catalogue=catalogue %}"

      Liquid::Template.parse(include).render(context)
    end
  end
end
Liquid::Template.register_tag('buildscript', Ladysnake::TabbedBuildScriptTag)
