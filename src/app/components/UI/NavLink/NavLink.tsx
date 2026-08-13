import type { MouseEvent } from "react";
import { usePageTransition } from "../../../hooks/usePageTransition";
import styles from "./NavLink.module.scss";
import AnimatedLink from "../AnimatedLink/AnimatedLink";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const { transitionTo } = usePageTransition();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    transitionTo(href);
  };

  return (
    <AnimatedLink
      href={href}
      onClick={onClick}
      className={styles["arrow-link"]}
    >
      <span className={styles["arrow-link-text"]}>{children}</span>
    </AnimatedLink>
  );
};

export default NavLink;
