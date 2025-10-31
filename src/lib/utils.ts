export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const getPhotoUrl = (path: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  return path.startsWith('http') ? path : `${baseUrl}${path}`;
};

export const extractS3Key = (fileUrl: string | null | undefined): string => {
  if (!fileUrl) return ''
  // strip query string
  const withoutQuery = fileUrl.split('?')[0]
  // if it's not a URL (already a key), return as-is
  if (!withoutQuery.startsWith('http')) return withoutQuery
  try {
    const u = new URL(withoutQuery)
    const host = u.hostname // e.g. bucket.s3.amazonaws.com or s3.region.amazonaws.com
    const parts = u.pathname.split('/').filter(Boolean) // remove leading '' from '/key'

    // Virtual-hosted style: bucket.s3.amazonaws.com -> pathname is '/key' => join parts
    if (host.includes('.s3.') || host.endsWith('.s3.amazonaws.com')) {
      // host contains the bucket (bucket.s3.amazonaws.com) -> parts are the key
      if (host.startsWith('s3.') || host === 's3.amazonaws.com') {
        // path-style: s3.region.amazonaws.com/bucket/key -> remove bucket segment
        if (parts.length >= 2) return parts.slice(1).join('/')
        return parts.join('/')
      }
      // virtual-hosted: bucket in host, key is full pathname
      return parts.join('/')
    }

    // Fallback: if path looks like /bucket/key, remove first segment (bucket)
    if (parts.length >= 2) return parts.slice(1).join('/')

    return parts.join('/')
  } catch (err) {
    return withoutQuery
  }
}