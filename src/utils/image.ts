const PLACEHOLDER = '/images/anh-chung.jpg';

export function getImageUrl(hinhAnh: string | undefined | null): string {
  if (!hinhAnh) return PLACEHOLDER;
  if (hinhAnh.startsWith('http') || hinhAnh.startsWith('/')) return hinhAnh;
  return PLACEHOLDER;
}
