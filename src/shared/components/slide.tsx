import React, { useState } from "react";
import { animated, Spring } from "react-spring";
import VisibilitySensor from "react-visibility-sensor";

/**
 * Wraps around child elements and applies a slide in animation, either from the left
 * or the right.
 *
 * Usage:
 *  <ZestiSlideIn left={true}>
 *    <div> I will slide in from the left </div>
 *  </ZestiSlideIn>
 *
 * @param props:
 *  children (JSX.Element), child of the slidein
 *  left: whether to slide in from the left or right
 */
export const SlideIn = (props: { children: JSX.Element; left: boolean }) => {
  const [once, setOnce] = useState(false);
  return (
    <VisibilitySensor>
      {({ isVisible }) => {
        if (isVisible) {
          setOnce(true);
        }
        return (
          <div {...props}>
            <div>
              <Spring
                config={{ tension: 100 }}
                from={{
                  transform: props.left
                    ? "translateX(-200%)"
                    : "translateX(200%)",
                }}
                to={{
                  transform:
                    isVisible || once
                      ? "translateX(0)"
                      : props.left
                      ? "translateX(-200%)"
                      : "translateX(200%)",
                }}
              >
                {(transform) => {
                  return (
                    <animated.div style={transform}>
                      {props.children}
                    </animated.div>
                  );
                }}
              </Spring>
            </div>
          </div>
        );
      }}
    </VisibilitySensor>
  );
};
