import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/layouts/main-layout.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineQuestionCircle, AiOutlineUser } from 'react-icons/ai';
import { TbMessageCircle2 } from 'react-icons/tb';
import { FiSettings, FiUsers } from 'react-icons/fi';
import { RiContactsLine, RiNotification3Line } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';
import { MdLanguage, MdOutlineDarkMode } from 'react-icons/md';
import Avatar from 'react-avatar';
import { DarkModeContext } from '../../contexts/DarkModeProvider';
import { KEY_LANGUAGE, URL_NEW_MESSAGE_AUDIO } from '../../constants';
import useTranslate from '@/hooks/useTranslate';
import Divider from '@/components/Divider';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { SocketContext, SocketContextType } from 'contexts/SocketContext';
import { SOCKET_EVENT } from '@/constants/Socket';
import { useAudio } from '@/hooks/useAudio';
import { onOpenHotkey } from '@/redux/features/HotkeySlice';

interface ISidebar {}

const Sidebar: React.FC<ISidebar> = () => {
  const router = useRouter();
  const {
    query: { tab },
  } = router;
  const { onSetTheme } = useContext(DarkModeContext);
  const t: any = useTranslate();
  const { removeAuth, auth } = useContext(AuthContext) as AuthContextType;
  const { countRequestFriend } = useAppSelector((state) => state.notify);
  const { socket } = useContext(SocketContext) as SocketContextType;
  const [chatCount, setChatCount] = useState(0);
  const { handlePlayAudio } = useAudio(URL_NEW_MESSAGE_AUDIO);
  const dispatch = useAppDispatch();

  const onChangeLang = async (lang: string) => {
    await router.push(router.asPath, router.asPath, {
      locale: lang ? lang : 'en',
    });
    localStorage.setItem(KEY_LANGUAGE, lang);
  };

  const handleLogout = async () => {
    removeAuth();
    await router.push('/auth');
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_EVENT.MESSAGE.NEW_MESSAGE, (data: MessageType[]) => {
      if (data[0].sender._id !== auth?._id) {
        setChatCount(chatCount + 1);
        handlePlayAudio();
      }
    });
  }, [socket, chatCount, auth]);

  return (
    <>
      <div
        className={`dark:bg-via-300 ${styles.wrapperSidebar} border-t border-light-400 dark:border-night-400 lg:border-t-none`}>
        <Link
          href={'/'}
          className={
            'w-full h-[70px] items-center justify-center hidden lg:flex'
          }>
          <Image src={'/logo.svg'} alt={'Logo'} width={30} height={30} />
        </Link>
        <ul
          className={
            'justify-around w-full lg:justify-center items-center flex lg:flex-col gap-2.5'
          }>
          <SidebarItemLink
            tabText={'profile'}
            isActive={tab === 'profile' || !tab}
            tooltip={t.home.sidebar.profile}
            icon={
              <AiOutlineUser
                className={tab === 'profile' || !tab ? 'text-primary' : ''}
                size={25}
              />
            }
          />
          <SidebarItemLink
            tabText={'chat'}
            isActive={tab === 'chat'}
            indicatorCount={chatCount}
            tooltip={t.home.sidebar.chat}
            onCallback={() => {
              setChatCount(0);
            }}
            icon={
              <TbMessageCircle2
                className={tab === 'chat' ? 'text-primary' : ''}
                size={24}
              />
            }
          />
          <SidebarItemLink
            tabText={'pending'}
            isActive={tab === 'pending'}
            tooltip={t.home.sidebar.pending}
            indicatorCount={countRequestFriend}
            icon={
              <FiUsers
                className={tab === 'pending' ? 'text-primary' : ''}
                size={24}
              />
            }
          />
          <SidebarItemLink
            tabText={'contact'}
            isActive={tab === 'contact'}
            tooltip={t.home.sidebar.contact}
            icon={
              <RiContactsLine
                className={tab === 'contact' ? 'text-primary' : ''}
                size={24}
              />
            }
          />
          <SidebarItemLink
            tabText={'setting'}
            isActive={tab === 'setting'}
            tooltip={t.home.sidebar.setting}
            path={'/settings'}
            icon={
              <FiSettings
                className={tab === 'setting' ? 'text-primary' : ''}
                size={24}
              />
            }
          />
          <SidebarItemLink
            tabText={'help'}
            onCallback={() => dispatch(onOpenHotkey(true))}
            tooltip={t.home.sidebar.help}
            icon={<AiOutlineQuestionCircle size={24} />}
          />
        </ul>
        <ul className={'hidden lg:flex flex-col gap-2.5 mb-5'}>
          <li className={'dropdown dropdown-top'}>
            <label
              tabIndex={0}
              data-tip={t.home.sidebar.language}
              className={`tooltip tooltip-right ${styles.sidebarItem}`}>
              <MdLanguage size={26} />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content dark:bg-night-200 menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a
                  className={
                    router.locale === 'vi'
                      ? 'bg-slate-200 dark:bg-slate-600'
                      : ''
                  }
                  onClick={() => onChangeLang('vi')}>
                  Vietnamese
                </a>
              </li>
              <li>
                <a
                  className={
                    router.locale === 'en'
                      ? 'bg-slate-200 dark:bg-slate-600'
                      : ''
                  }
                  onClick={() => onChangeLang('en')}>
                  English
                </a>
              </li>
            </ul>
          </li>
          <li
            onClick={() => onSetTheme(null)}
            data-tip={t.home.sidebar.darkMode}
            className={`tooltip tooltip-right ${styles.sidebarItem}`}>
            <MdOutlineDarkMode size={26} />
          </li>
          <li className={'dropdown dropdown-top'}>
            <label tabIndex={0} className={`${styles.sidebarItem}`}>
              <Avatar
                name={`${auth?.firstName} ${auth?.lastName}`}
                src={auth?.avatar || ''}
                size={'40px'}
                round
              />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content dark:bg-night-200 menu p-2 shadow bg-base-100 rounded-box w-52">
              <li
                onClick={() =>
                  router.push({
                    pathname: '/',
                    query: {
                      ...router.query,
                      tab: 'profile',
                    },
                  })
                }>
                <a>{t.home.sidebar.profile}</a>
              </li>
              <li
                onClick={() =>
                  router.push({
                    pathname: '/settings',
                    query: {
                      ...router.query,
                      tab: 'settings',
                    },
                  })
                }>
                <a>{t.home.sidebar.setting}</a>
              </li>
              <Divider />
              <li>
                <a onClick={handleLogout}>{t.home.sidebar.logout}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};

type SidebarItemLinkType = {
  icon: React.ReactNode;
  tooltip?: string;
  isActive?: boolean;
  tabText?: string;
  path?: string;
  indicatorCount?: number;
  onCallback?: () => void;
};

const SidebarItemLink = ({
  icon,
  tooltip,
  isActive,
  tabText,
  path,
  indicatorCount,
  onCallback,
}: SidebarItemLinkType) => {
  const router = useRouter();

  return (
    <li
      data-tip={tooltip}
      onClick={async () => {
        if (path) {
          await router.replace({
            pathname: path
              ? path
              : router.pathname === '/settings'
              ? '/'
              : router.pathname,
            query: { ...router.query, tab: tabText },
          });
        }
        onCallback && onCallback();
      }}
      className={twMerge(
        `tooltip lg:tooltip-right tooltip-top indicator ${styles.sidebarItem} hover:bg-slate-200 dark:hover:bg-slate-700`,
        isActive ? 'bg-slate-200 dark:bg-slate-700' : ''
      )}>
      {!!indicatorCount && (
        <span className="indicator-item badge badge-primary">
          {indicatorCount > 99 ? '99+' : indicatorCount}
        </span>
      )}
      {icon}
    </li>
  );
};

export default Sidebar;
