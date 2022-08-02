import * as React from "react";

const NavLink: React.FC<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
> = ({ children, ...props }) => (
  <a {...props} className="hover:underline">
    {children}
  </a>
);

const Nav: React.FC = () => {
  const avatarRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    let handle: number = null;

    const refreshAvatarAngle = () => {
      if (avatarRef.current) {
        avatarRef.current.style.transform = `rotate(${
          (0.25 * window.scrollY) % 360
        }deg`;
      }

      handle = requestAnimationFrame(refreshAvatarAngle);
    };

    refreshAvatarAngle();

    return () => {
      if (handle !== null) cancelAnimationFrame(handle);
    };
  }, []);

  return (
    <nav className="mb-24 w-full max-w-3xl self-center flex items-center gap-8 2xl:fixed 2xl:left-8 2xl:flex-col 2xl:items-stretch 2xl:w-48">
      <a href="/">
        <img
          ref={avatarRef}
          alt="Go to homepage"
          src="/images/avatar.png"
          className="w-12 rounded-full 2xl:h-16 2xl:w-16 2xl:mx-0 2xl:mb-4"
        />
      </a>
      <ul className="flex gap-4 text-lg 2xl:flex-col 2xl:text-xl">
        <li>
          <NavLink href="/">Home</NavLink>
        </li>
        <li>
          <NavLink href="/blog">Blog</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
