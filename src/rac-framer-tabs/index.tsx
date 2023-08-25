import { AnimationPlaybackControls, animate, motion, useScroll, useTransform } from 'framer-motion';
import { useState, type FC, useRef, useEffect, useCallback } from 'react';
import { Collection, Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import styled from 'styled-components';
import { useEvent } from '../useEvent';

interface RacFramerTabsProps { }

/**
 * https://codesandbox.io/s/rac-framer-tabs-rrdcly?file=/src/App.js:68-89
 * @returns 
 */


const tabs = [
  { id: "world", label: "World" },
  { id: "ny", label: "N.Y." },
  { id: "business", label: "Business" },
  { id: "arts", label: "Arts" },
  { id: "science", label: "Science" }
];
const RacFramerTabs: FC<RacFramerTabsProps> = () => {
  const [selectedKey, setSelectedKey] = useState(tabs[0].id);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabPanelsRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({
    container: tabPanelsRef
  });


  // Find all the tab elements so we can use their dimensions.
  const [tabElements, setTabElements] = useState<NodeListOf<HTMLElement>>();

  /**获得偏移量下的最小坐标 */
  const getIndex = useCallback(
    (x: number) => Math.max(0, Math.floor((tabElements!.length - 1) * x)),
    [tabElements]
  );

  /**
   * 计算滚动到x处的平均差异
   * @param x 
   * @param property 
   * @returns 
   */
  const transform = useEvent(function transform(x: number, property: "offsetLeft" | "offsetWidth") {
    if (!tabElements?.length) {
      return 0
    }
    //x归属的位置,取偏小的,0~lenght-1
    const index = getIndex(x)

    //相邻块的差异大小
    const difference = index < tabElements.length - 1
      ? tabElements[index + 1][property] - tabElements[index][property]
      : tabElements[index].offsetWidth

    //相邻的百分比
    const percent = (tabElements.length - 1) * x - index

    //以index坐标为基础,减去差异大小
    const value = tabElements[index][property] + difference * percent
    // console.log(index, value)
    //由于某种原因，当 translateX 为 0 时，iOS 滚动会很奇怪。 🤷‍♂️
    return value || 0.1
  })

  /**指标的位置与偏移,通过滚动控制*/
  const x = useTransform(scrollXProgress, (x) => transform(x, "offsetLeft"));
  const width = useTransform(scrollXProgress, (x) => transform(x, "offsetWidth"));

  useEffect(() => {
    scrollXProgress.on("change", x => {
      if (animationRef.current || !tabElements?.length) {
        return
      }
      setSelectedKey(tabs[getIndex(x)].id)
    })
  }, [scrollXProgress, getIndex, tabElements])

  useEffect(() => {
    if (!tabElements?.length) {
      const tabs = tabListRef.current?.querySelectorAll("[role=tab]");
      setTabElements(tabs as NodeListOf<HTMLDivElement>);
    }
  }, [tabElements]);
  const animationRef = useRef<AnimationPlaybackControls>();
  return (<Wrapper>
    <Tabs
      className="w-fit mx-auto max-w-[350px] my-12"
      selectedKey={selectedKey}
      onSelectionChange={e => {
        setSelectedKey(e as any)
        if (scrollXProgress.getVelocity() && !animationRef.current) {
          //存在速度,且没有动画
          return
        }
        const tabPanel = tabPanelsRef.current!
        const index = tabs.findIndex(tab => tab.id == e)
        if (animationRef.current) {
          animationRef.current.stop()
        }
        /**动画,从当前的scrollLeft,运行到将当前彻底居正——>滚动到指定页面*/
        animationRef.current = animate(
          tabPanel.scrollLeft,
          tabPanel.scrollWidth * (index / tabs.length),
          {
            type: "spring",
            bounce: 0.2,
            duration: 0.6,
            onUpdate(latest) {
              tabPanel.scrollLeft = latest
            },
            onPlay() {
              tabPanel.style.scrollSnapType = "none"
            },
            onComplete() {
              tabPanel.style.scrollSnapType = ""
            },
          }
        )
      }}
    >
      <div className="relative bg-white">
        <TabList ref={tabListRef} className="flex space-x-1" items={tabs}>
          {(tab) =>
            // prettier-ignore
            <Tab className={({ isSelected }) => `${isSelected ? "" : "data-[hovered]:text-black/70 data-[pressed]:text-black/60"} cursor-default px-3 py-1.5 text-md sm:text-sm text-black transition outline-none touch-none`}>
              {({ isSelected, isFocusVisible }) => <>
                {tab.label}
                {isFocusVisible && isSelected && (
                  // Focus ring. 在键盘事件下才展示
                  <motion.span
                    className="abc absolute inset-0 z-10 rounded-full ring-2 ring-black ring-offset-2"
                    style={{ x, width }}
                  />
                )}
              </>}
            </Tab>
          }
        </TabList>
        {/* Selection indicator. */}
        <motion.span
          className="absolute inset-0 z-10 bg-white rounded-full mix-blend-difference"
          style={{ x, width }}
        />
      </div>
      <div
        ref={tabPanelsRef}
        className="my-4 text-black font-light text-sm overflow-auto snap-x snap-mandatory no-scrollbar flex"
      >
        <Collection items={tabs}>
          {(tab) => (
            <TabPanel
              shouldForceMount
              className="flex-shrink-0 w-full px-2 snap-start outline-none -outline-offset-2 rounded data-[focus-visible]:outline-black"
            >
              <h2 className="mb-2 font-semibold">{tab.label} contents...</h2>
              {/* prettier-ignore */}
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet nisl blandit, pellentesque eros eu, scelerisque eros. Sed cursus urna at nunc lacinia dapibus.</p>
            </TabPanel>
          )}
        </Collection>
      </div>
    </Tabs>
  </Wrapper>);
}

const Wrapper = styled.div`
position: fixed;
top: 0;
background-color: white;
width: 100%;
height: 100%;
color: black;
`

export default RacFramerTabs;
