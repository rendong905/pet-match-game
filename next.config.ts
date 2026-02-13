import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: {
  allowedDevOrigins: string[];
  images: {
    unoptimized: boolean;
    remotePatterns: Array<{
      protocol: string;
      hostname: string;
      pathname: string;
    }>;
  };
} = {
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    unoptimized: true, // 禁用图片优化，避免构建时处理外部图片
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf-coze-web-cdn.coze.cn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'code.coze.cn',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
