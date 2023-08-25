import { FC, Key, useEffect, useRef } from "react";
import Loading from "./Loading";

interface LoadMoreViewProps {
  loadMoreVersion: Key
  loadMore(): Promise<any> | void;
  containerRef?: React.RefObject<HTMLElement>;
}

/**
 * 需要一个key作为version,触发加载更多
 * @param param0
 * @returns
 */
const LoadMoreView: FC<LoadMoreViewProps> = ({ loadMore, containerRef, loadMoreVersion }) => {
  const footerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const destroy = observerIntersection(
      (e) => {
        // console.log(e[0].intersectionRatio, '--')
        if (e[0].intersectionRatio == 1) {
          // console.log("满足条件")
          if (loadMore()) {
            // console.log("销毁1")
            destroy()
          }
        }
      },
      footerRef.current!,
      {
        threshold: 1,
        root: containerRef?.current!,
      }
    );
    return destroy
  }, [loadMoreVersion]);
  return (
    <div ref={footerRef} className="load-more">
      <Loading />
    </div>
  );
};
export default LoadMoreView;

export function observerIntersection(
  callback: IntersectionObserverCallback,
  flag: Element,
  options?: IntersectionObserverInit
) {
  const observer = new IntersectionObserver(callback, options);
  observer.observe(flag);
  return function () {
    observer.unobserve(flag);
    observer.disconnect();
  };
}
