{
  description = "Jekyll setup";

    outputs = { self, nixpkgs }:
    let
      pkgs = import nixpkgs { system = "x86_64-linux"; };
      gems = pkgs.bundlerEnv {
          name = "gems";
          ruby = pkgs.ruby;
          gemfile = ./Gemfile;
          lockfile = ./Gemfile.lock;
          gemset = ./gemset.nix;
        };
    in
    {
      devShells.x86_64-linux.default = pkgs.mkShell {
        packages = [
          gems pkgs.bundix
        ];
       };
    };
}
