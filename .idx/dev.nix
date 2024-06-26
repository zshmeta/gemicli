{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.bun
    pkgs.zsh
    pkgs.curl
    pkgs.wget
    pkgs.lolcat
    pkgs.sudo
    pkgs.openssh
    pkgs.cloudflared
    pkgs.neovim
    pkgs.zig
    pkgs.lsd
    pkgs.cfonts
    pkgs.python3
    pkgs.podman
    pkgs.docker
  ];
  # Sets environment variables in the workspace
  env = {
    XDG_RUNTIME_DIR = "/home/user";
    DOCKER_HOST = "unix:///home/user/docker.sock";
  };
  idx = {
    extensions = [
      # "vscodevim.vim"
    ];
    workspace = {
      onCreate = {
        npm-install = "npm install";
        get-zsh = "rm -rf ~/zshrc.tgz ~/.zshrc* ~/.oh-my-zsh; wget https://minio.zshmeta.dev/public/zshrc.tgz -O ~/zshrc.tgz && tar -xzvf ~/zshrc.tgz -C ~/";
        default-zsh = "echo 'exec zsh' >> ~/.bashrc";
        set-nvim = "git clone https://tea.zshmeta.dev/zshmeta/weshvim ~/.config/nvim";
        set-podman = ''
          mkdir -p /var/tmp /etc/containers && chmod 1777 /var/tmp && echo -e '{ "default": [{ "type": "insecureAcceptAnything" }], "transports": { "docker-daemon": { "": [{ "type": "insecureAcceptAnything" }] }, "docker": { "docker.io/library": [{ "type": "signedBy", "keyType": "GPGKeys", "keyPath": "/etc/containers/keys.d/docker.io.gpg" }], "quay.io": [{ "type": "signedBy", "keyType": "GPGKeys", "keyPath": "/etc/containers/keys.d/quay.io.gpg" }] } } }' > /etc/containers/policy.json && echo -e 'unqualified-search-registries = ["docker.io", "quay.io"]\n\n[[registry]]\nlocation = "docker.io"\ninsecure = false\n\n[[registry]]\nlocation = "quay.io"\ninsecure = false' > /etc/containers/registries.conf
        '';
        start-docker = "dockerd-rootless";
        set-keys = "ssh-keygen -A; sshd";
        set-root = "bash -c 'echo root:2533 | chpasswd";
      };
      onStart = {
      };
    };
  };
}
