// Utility functions for adding watermarks to images

export function addWatermarkToImage(
  imageFile: File,
  timestamp: string,
  vehiclePlate: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Format timestamp
        const date = new Date(timestamp);
        const dateStr = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        });

        // Watermark settings
        const padding = 20;
        const fontSize = Math.max(16, Math.min(img.width / 25, 32));
        const lineHeight = fontSize * 1.4;

        // Prepare text
        const lines = [
          `${vehiclePlate}`,
          `${dateStr} ${timeStr}`
        ];

        // Measure text width
        ctx.font = `bold ${fontSize}px monospace`;
        const maxTextWidth = Math.max(...lines.map(line => ctx.measureText(line).width));

        // Calculate background dimensions
        const bgWidth = maxTextWidth + padding * 2;
        const bgHeight = (lines.length * lineHeight) + padding * 2;
        const bgX = img.width - bgWidth - 10;
        const bgY = img.height - bgHeight - 10;

        // Draw semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

        // Draw border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(bgX, bgY, bgWidth, bgHeight);

        // Draw text
        ctx.fillStyle = 'white';
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        lines.forEach((line, index) => {
          ctx.fillText(
            line,
            bgX + padding,
            bgY + padding + (index * lineHeight)
          );
        });

        // Convert canvas to blob URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg', 0.95);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(imageFile);
  });
}

export function addWatermarkToImageUrl(
  imageUrl: string,
  timestamp: string,
  vehiclePlate: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const date = new Date(timestamp);
      const dateStr = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const timeStr = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const padding = 20;
      const fontSize = Math.max(16, Math.min(img.width / 25, 32));
      const lineHeight = fontSize * 1.4;

      const lines = [
        `${vehiclePlate}`,
        `${dateStr} ${timeStr}`
      ];

      ctx.font = `bold ${fontSize}px monospace`;
      const maxTextWidth = Math.max(...lines.map(line => ctx.measureText(line).width));

      const bgWidth = maxTextWidth + padding * 2;
      const bgHeight = (lines.length * lineHeight) + padding * 2;
      const bgX = img.width - bgWidth - 10;
      const bgY = img.height - bgHeight - 10;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(bgX, bgY, bgWidth, bgHeight);

      ctx.fillStyle = 'white';
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      lines.forEach((line, index) => {
        ctx.fillText(
          line,
          bgX + padding,
          bgY + padding + (index * lineHeight)
        );
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.95);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}
