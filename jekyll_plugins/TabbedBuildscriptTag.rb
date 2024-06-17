module Ladysnake
  ##
  # A tag that can generate HTML markup for a Gradle buildscript with each tab containing
  # instructions for a specific format
  #
  # Usage:
  #  "{%- buildscript [key1:value1], [key2:value2] -%}
  #  [build.gradle]
  #  Instructions for Groovy build.gradle
  #
  #  [build.gradle.kts]
  #  Instructions for Kotlin build.gradle.kts
  #
  #  [catalogue]
  #  Instructions for `libs.versions.toml`
  #  {%- endbuildscript -%}"
  #
  # By default, only the Minecraft versions relevant to the first mod in the list
  # will be shown. You can add the show_all_versions parameter to the tag to make it
  # so every Minecraft version that has at least one mod version for it gets displayed.
  class TabbedBuildScriptTag < Liquid::Block
    def initialize(tag_name, text, tokens)
      super
      @input = text
    end

    def render(context)
      body = super
      mods = Hash[@input.scan(/\[(\w+):(\w+)\]/)]
      tabs = Hash[TabbedTag.parse_tabs(body)]
      show_all_versions = @input.include? "show_all_versions"

      context["groovy"] = tabs["groovy"]
      context["kts"] = tabs["kts"]
      context["catalogue"] = tabs["catalogue"]
      context["mods"] = mods
      context["show_all_versions"] = show_all_versions

      include = "{% include tabbed_buildscript.liquid mods=mods groovy=groovy kts=kts catalogue=catalogue %}"

      Liquid::Template.parse(include).render(context)
    end
  end
end
Liquid::Template.register_tag('buildscript', Ladysnake::TabbedBuildScriptTag)
