import './skeleton-shimmer.css' // 스켈레톤 애니메이션을 위한 CSS 파일 import

// 스켈레톤 UI를 위한 컴포넌트
export default function ShimmerSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton-shimmer relative overflow-hidden rounded bg-gray-200 ${className}`}>
      <div className="shimmer-effect"></div>
    </div>
  )
}
