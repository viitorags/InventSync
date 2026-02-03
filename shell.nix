{
  pkgs ? import <nixpkgs> {
    config.allowUnfree = true;
  },
}:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs
    php
    php.packages.composer
    laravel
    nodePackages.intelephense
    phpactor
    php.packages.php-cs-fixer
    php.packages.php-codesniffer
    vtsls
  ];
}
