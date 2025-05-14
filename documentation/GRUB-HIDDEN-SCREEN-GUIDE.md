# GRUB Hidden Screen Configuration Guide

This guide will help you configure GRUB (Grand Unified Bootloader) to have a hidden screen and black background on your Ubuntu system.

## Check Your GRUB Version

First, check which version of GRUB you have:

```bash
grub-install --version
```

You should have GRUB 2.02 or higher for these features to work properly.

## Configure GRUB for Hidden Screen and Black Background

1. **Edit the GRUB configuration file**:
   ```bash
   sudo nano /etc/default/grub
   ```

2. **Add or modify these settings**:
   ```
   # Hide the menu by default
   GRUB_TIMEOUT_STYLE=hidden
   GRUB_TIMEOUT=0
   
   # Black background
   GRUB_BACKGROUND=""
   GRUB_THEME=""
   
   # Optional: Remove boot text completely (quiet boot)
   GRUB_CMDLINE_LINUX_DEFAULT="quiet splash vt.global_cursor_default=0"
   ```

3. **Update GRUB**:
   ```bash
   sudo update-grub
   ```

4. **Reboot to apply changes**:
   ```bash
   sudo reboot
   ```

## Advanced Customization (Optional)

If you want to further customize the appearance:

1. **Create a custom GRUB theme with black background**:
   ```bash
   sudo mkdir -p /boot/grub/themes/black
   
   # Create a theme.txt file
   sudo nano /boot/grub/themes/black/theme.txt
   ```

2. **Add this content to the theme file**:
   ```
   # Black theme for GRUB
   
   title-text: ""
   message-text: ""
   terminal-box: "terminal_box_*.png"
   terminal-font: "DejaVu Sans Regular 12"
   desktop-image: "background.png"
   desktop-color: "#000000"
   
   + boot_menu {
       left = 0
       top = 0
       width = 100%
       height = 100%
       item_color = "#FFFFFF"
       selected_item_color = "#FFFFFF"
       item_height = 0
       item_spacing = 0
       item_padding = 0
       item_font = "DejaVu Sans Regular 0"
       selected_item_font = "DejaVu Sans Regular 0"
       icon_width = 0
       icon_height = 0
       item_icon_space = 0
       scrollbar = false
       menu_pixmap_style = "boot_menu_*.png"
       scrollbar_thumb = "slider_*.png"
   }
   ```

3. **Create a simple black background image**:
   ```bash
   sudo convert -size 1920x1080 xc:black /boot/grub/themes/black/background.png
   ```
   Note: If you don't have ImageMagick installed, install it with: `sudo apt install imagemagick`

4. **Update your GRUB configuration**:
   ```bash
   sudo nano /etc/default/grub
   ```

5. **Set the theme**:
   ```
   GRUB_THEME="/boot/grub/themes/black/theme.txt"
   ```

6. **Update GRUB and reboot**:
   ```bash
   sudo update-grub
   sudo reboot
   ```

## Troubleshooting

### If GRUB Still Shows or Has a Timeout

Try these more aggressive settings:

```bash
sudo nano /etc/default/grub
```

Update to:
```
GRUB_DEFAULT=0
GRUB_TIMEOUT_STYLE=hidden
GRUB_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT_QUIET=true
```

Then update and reboot:
```bash
sudo update-grub
sudo reboot
```

### If You Need to Access GRUB Menu Occasionally

Hold the SHIFT key during boot to make the GRUB menu appear when needed.

### If Running Ubuntu on a Mac

For Mac systems running Ubuntu, you may need additional configuration:

```bash
sudo nano /etc/default/grub
```

Add:
```
GRUB_CMDLINE_LINUX="reboot=pci"
```

Then update and reboot:
```bash
sudo update-grub
sudo reboot
```

This helps with proper handling of Mac hardware during boot.