Source repository for https://ladysnake.github.io

To run the site locally, follow these steps:
0. Clone this repository
    - If you already installed Jekyll, skip to step 4
    - If you run NixOS with Flakes enabled, run `nix develop` and skip to step 4
1. Install [Ruby](https://www.ruby-lang.org/en/downloads/) with its development headers
2. Install Bundler (requires admin rights):
	```bash
	$ gem install bundler
	```
3. Setup Jekyll (from the root of this repository, requires admin rights):
	```bash
	$ bundle install
	> Fetching gem metadata from https://rubygems.org/............
	> Fetching version metadata from https://rubygems.org/...
	> Fetching dependency metadata from https://rubygems.org/..
	> Resolving dependencies...
	```
4. Start the site (from the root of this repository):
	```bash
	$ bundle exec jekyll serve
	> Configuration file: /Users/octocat/ladysnake.github.io/_config.yml
	>            Source: /Users/octocat/ladysnake.github.io
	>       Destination: /Users/octocat/ladysnake.github.io/_site
	> Incremental build: disabled. Enable with --incremental
	>      Generating...
	>                    done in 0.309 seconds.
	> Auto-regeneration: enabled for '/Users/octocat/ladysnake.github.io'
	> Configuration file: /Users/octocat/ladysnake.github.io/_config.yml
	>    Server address: http://127.0.0.1:4000/
	>  Server running... press ctrl-c to stop.
	```
5. Preview your copy of the site in your web browser at http://localhost:4000.
