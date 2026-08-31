'use client';
import Link from 'next/link';
import { LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { User2 } from 'lucide-react';
import Solvly from '@/icons/Solvly';
import UserAvatar from './UserAvatar';
import { logout } from '@/features/authslice';
import { logoutUser } from '@/api/user';
import styles from '@/styles/Navbar.module.css';

const navLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Questions', href: '/question' },
  { label: 'Ranking', href: '/ranking' },
  // { label: 'Trending', href: '/trending' },
];

function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : 'Something went wrong';
      console.warn(errMessage);
    } finally {
      dispatch(logout());
      setMobileMenuOpen(false);
    }
  };

  const closeDrawer = () => setMobileMenuOpen(false);

  return (
    <>
      {/* ── Navbar ── */}
      <nav
        className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : styles.navbarTop}`}
      >
        <div className={styles.inner}>
          <div className={styles.row}>
            {/* Logo */}
            <Link href='/' className={styles.logo}>
              <Solvly height='28px' width='28px' color='#BCA88D' />
              <span className={styles.logoText}>Solvly</span>
            </Link>

            {/* Desktop nav links */}
            <div className={styles.desktopLinks}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.navLink}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop auth */}
            <div className={styles.desktopAuth}>
              {isAuthenticated ? (
                <>
                  <span className={styles.userGreeting}>
                    hi, <span className={styles.userName}>{user?.name}</span>
                  </span>
                  {user?.avatar ? (
                    <Link
                      href={`/profile/${user?.id}`}
                      className={styles.avatarRing}
                    >
                      <UserAvatar svg={user?.avatar} />
                    </Link>
                  ) : (
                    <Link
                      href='/profile'
                      className={`${styles.avatarRing} ${styles.avatarPlaceholder}`}
                    >
                      <User2 size={18} />
                    </Link>
                  )}
                  <button
                    className={styles.logoutBtn}
                    onClick={handleLogout}
                    title='Logout'
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Link href='/login' className={styles.btnSignin}>
                    Sign In
                  </Link>
                  <Link href='/register' className={styles.btnGetStarted}>
                    <Sparkles size={13} />
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label='Open menu'
            >
              <Menu size={20} color='#3E3F29' />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile overlay ── */}
      <div
        className={`${styles.overlay} ${mobileMenuOpen ? styles.overlayOpen : ''}`}
        onClick={closeDrawer}
      />

      {/* ── Mobile drawer ── */}
      <div
        className={`${styles.drawer} ${mobileMenuOpen ? styles.drawerOpen : ''}`}
      >
        <div className={styles.drawerHeader}>
          <Link href='/' className={styles.logo} onClick={closeDrawer}>
            <Solvly height='24px' width='24px' color='#BCA88D' />
            <span className={styles.logoText} style={{ fontSize: '1.1rem' }}>
              Solvly
            </span>
          </Link>
          <button
            className={styles.drawerClose}
            onClick={closeDrawer}
            aria-label='Close menu'
          >
            <X size={18} />
          </button>
        </div>

        <nav className={styles.drawerNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.drawerLink}
              onClick={closeDrawer}
            >
              <span className={styles.drawerLinkDot} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.drawerFooter}>
          {isAuthenticated ? (
            <>
              <Link
                href={`/profile/${user?.id}`}
                className={styles.drawerUserCard}
                onClick={closeDrawer}
              >
                {user?.avatar ? (
                  <UserAvatar svg={user?.avatar} />
                ) : (
                  <div className={styles.drawerUserIcon}>
                    <User2 size={20} color='#fff' />
                  </div>
                )}
                <div className={styles.drawerUserInfo}>
                  <div className={styles.drawerUserName}>{user?.name}</div>
                  <div className={styles.drawerUserSub}>View profile →</div>
                </div>
              </Link>
              <button
                className={`${styles.drawerBtnFull} ${styles.drawerBtnLogout}`}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href='/register'
                className={`${styles.drawerBtnFull} ${styles.drawerBtnPrimary}`}
                onClick={closeDrawer}
              >
                <Sparkles size={14} />
                Get Started
              </Link>
              <Link
                href='/login'
                className={`${styles.drawerBtnFull} ${styles.drawerBtnSecondary}`}
                onClick={closeDrawer}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
