import React from 'react'
import useTranslate from '@/hooks/useTranslate'
import { twMerge } from 'tailwind-merge';

interface IProps {
  tabActive: SidebarMP3;
  setTabActive: (value: SidebarMP3) => void;
}

const Sidebar: React.FC<IProps> = ({tabActive, setTabActive}) => {
  const t: any = useTranslate()
  
  return (
    <div className='max-w-[70px] transition-all duration-300 lg:max-w-[240px] w-full bg-[#221a2d]'>
      {/* Desktop */}
      <div className='lg:block hidden'>
        <div className='flex items-center h-[70px] pr-[25px] pl-[28px] select-none'>
          <picture>
            <img className='w-[120px]' src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/backgrounds/logo-dark.svg" alt="" />
          </picture>
        </div>
        <ul className='flex flex-col'>
          <li onClick={() => setTabActive('charts')} className={twMerge('flex gap-2.5 text-white py-[12px] px-[21px] cursor-pointer hover:bg-[#393142]', tabActive === 'charts' && 'bg-[#393142]')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M20.25 2C20.25 1.58579 19.9142 1.25 19.5 1.25C19.0858 1.25 18.75 1.58579 18.75 2C18.75 2.95195 18.4626 3.63685 18.0656 4.07478C17.6709 4.51015 17.1258 4.75 16.5 4.75C16.0858 4.75 15.75 5.08579 15.75 5.5C15.75 5.91421 16.0858 6.25 16.5 6.25C17.126 6.25 17.671 6.48996 18.0657 6.9254C18.4628 7.36341 18.75 8.04835 18.75 9C18.75 9.41421 19.0858 9.75 19.5 9.75C19.9142 9.75 20.25 9.41421 20.25 9C20.25 8.04805 20.5374 7.36315 20.9344 6.92522C21.3291 6.48985 21.8742 6.25 22.5 6.25C22.9142 6.25 23.25 5.91421 23.25 5.5C23.25 5.08579 22.9142 4.75 22.5 4.75C21.874 4.75 21.329 4.51004 20.9343 4.0746C20.5372 3.63659 20.25 2.95165 20.25 2ZM19.1769 5.08231C19.2934 4.95373 19.4013 4.81641 19.5 4.6709C19.5987 4.81629 19.7064 4.95351 19.8229 5.082C19.9625 5.23602 20.1129 5.37549 20.2725 5.49999C20.113 5.62441 19.9627 5.76378 19.8231 5.91769C19.7066 6.04627 19.5987 6.18359 19.5 6.3291C19.4013 6.18371 19.2936 6.04649 19.1771 5.918C19.0375 5.76398 18.8871 5.62451 18.7275 5.50001C18.887 5.37559 19.0373 5.23622 19.1769 5.08231ZM13.5095 5.31294C13.5652 5.72339 13.2776 6.10128 12.8672 6.15698L12.3492 6.22728L11.3238 6.36644C10.186 6.55633 9.25 7.65728 9.25 8.74999V18.5C9.25 20.5711 7.57107 22.25 5.5 22.25C3.42893 22.25 1.75 20.5711 1.75 18.5C1.75 16.4289 3.42893 14.75 5.5 14.75C6.3442 14.75 7.12325 15.0289 7.75 15.4997V8.74999C7.75 6.89294 9.25015 5.18376 11.0921 4.88439L11.1116 4.88149L12.1475 4.7409L12.6655 4.67061C13.0759 4.61491 13.4538 4.90249 13.5095 5.31294ZM5.5 16.25C6.74264 16.25 7.75 17.2573 7.75 18.5C7.75 19.7426 6.74264 20.75 5.5 20.75C4.25736 20.75 3.25 19.7426 3.25 18.5C3.25 17.2573 4.25736 16.25 5.5 16.25ZM19.5 11.75C19.9142 11.75 20.25 12.0858 20.25 12.5V17.5C20.25 19.5711 18.5711 21.25 16.5 21.25C14.4289 21.25 12.75 19.5711 12.75 17.5C12.75 15.4289 14.4289 13.75 16.5 13.75C17.3442 13.75 18.1233 14.0289 18.75 14.4997V12.5C18.75 12.0858 19.0858 11.75 19.5 11.75ZM16.5 15.25C17.7426 15.25 18.75 16.2573 18.75 17.5C18.75 18.7426 17.7426 19.75 16.5 19.75C15.2574 19.75 14.25 18.7426 14.25 17.5C14.25 16.2573 15.2574 15.25 16.5 15.25Z" fillOpacity="0.8"></path></svg>
            <span>{t.charts}</span>
          </li>
          <li onClick={() => setTabActive('library')} className={twMerge('flex gap-2.5 text-white py-[12px] px-[21px] cursor-pointer hover:bg-[#393142]', tabActive === 'library' && 'bg-[#393142]')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M6.5 2.75C6.08579 2.75 5.75 3.08579 5.75 3.5C5.75 3.91421 6.08579 4.25 6.5 4.25H17.5C17.9142 4.25 18.25 3.91421 18.25 3.5C18.25 3.08579 17.9142 2.75 17.5 2.75H6.5ZM3 9.5C3 7.42893 4.67893 5.75 6.75 5.75H17.25C19.3211 5.75 21 7.42893 21 9.5V17.5C21 19.5711 19.3211 21.25 17.25 21.25H6.75C4.67893 21.25 3 19.5711 3 17.5V9.5ZM6.75 7.25C5.50736 7.25 4.5 8.25736 4.5 9.5V17.5C4.5 18.7426 5.50736 19.75 6.75 19.75H17.25C18.4926 19.75 19.5 18.7426 19.5 17.5V9.5C19.5 8.25736 18.4926 7.25 17.25 7.25H6.75ZM13.666 8.87596C13.4359 8.72253 13.14 8.70823 12.8961 8.83874C12.6522 8.96926 12.5 9.2234 12.5 9.5V13.0499C12.125 12.8581 11.7001 12.75 11.25 12.75C9.73122 12.75 8.5 13.9812 8.5 15.5C8.5 17.0188 9.73122 18.25 11.25 18.25C12.6911 18.25 13.8733 17.1415 13.9905 15.7307C13.9967 15.6916 14 15.6515 14 15.6107V15.5V10.9014L15.084 11.624C15.4286 11.8538 15.8943 11.7607 16.124 11.416C16.3538 11.0714 16.2607 10.6057 15.916 10.376L13.666 8.87596ZM12.5 15.5C12.5 14.8096 11.9404 14.25 11.25 14.25C10.5596 14.25 10 14.8096 10 15.5C10 16.1904 10.5596 16.75 11.25 16.75C11.9404 16.75 12.5 16.1904 12.5 15.5Z" fillOpacity="0.8"></path></svg>
            <span>{t.library}</span>
          </li>
          {/*<li onClick={() => setTabActive('search')} className={twMerge('flex gap-2.5 text-white py-[12px] px-[21px] cursor-pointer hover:bg-[#393142]', tabActive === 'search' && 'bg-[#393142]')}>*/}
          {/*  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M1.76078 11.5281C2.0086 6.08576 6.49865 1.75 12.0018 1.75C14.0559 1.75 15.971 2.35489 17.5759 3.39648C17.9234 3.62198 18.0222 4.08645 17.7967 4.4339C17.5712 4.78136 17.1068 4.88023 16.7593 4.65473C15.3901 3.76614 13.7574 3.25 12.0018 3.25C7.30422 3.25 3.47074 6.95138 3.25923 11.5963C3.24039 12.0101 2.88968 12.3303 2.47589 12.3114C2.06211 12.2926 1.74194 11.9419 1.76078 11.5281ZM21.5275 11.6871C21.9413 11.7057 22.2617 12.0563 22.243 12.4701C21.998 17.9149 17.5067 22.2536 12.0018 22.2536C9.89696 22.2536 7.93821 21.6184 6.30952 20.5292C5.9652 20.299 5.87274 19.8332 6.103 19.4889C6.33327 19.1446 6.79905 19.0521 7.14337 19.2824C8.53298 20.2117 10.203 20.7536 12.0018 20.7536C16.7009 20.7536 20.5354 17.0497 20.7445 12.4026C20.7632 11.9888 21.1137 11.6685 21.5275 11.6871ZM20.7535 8.05986C20.7535 7.40256 20.2207 6.86972 19.5634 6.86972C18.9061 6.86972 18.3732 7.40256 18.3732 8.05986C18.3732 8.71715 18.9061 9.25 19.5634 9.25C20.2207 9.25 20.7535 8.71715 20.7535 8.05986ZM19.5634 5.36972C21.0491 5.36972 22.2535 6.57413 22.2535 8.05986C22.2535 9.54558 21.0491 10.75 19.5634 10.75C19.1208 10.75 18.7031 10.6431 18.3349 10.4537L15.5083 14.5112C15.3814 14.6933 15.1803 14.8099 14.9592 14.8295C14.738 14.8491 14.5196 14.7698 14.3626 14.6128L13.3637 13.6139L12.2257 15.3202C12.0906 15.5227 11.8658 15.6471 11.6225 15.6538C11.3793 15.6605 11.1478 15.5488 11.0018 15.3542L9.05228 12.7558L6.78385 15.0242C6.75187 15.0562 6.71772 15.0847 6.68188 15.1097C6.80299 15.4073 6.86972 15.7328 6.86972 16.074C6.86972 17.4877 5.72363 18.6338 4.30986 18.6338C2.89609 18.6338 1.75 17.4877 1.75 16.074C1.75 14.6602 2.89609 13.5141 4.30986 13.5141C4.83856 13.5141 5.32983 13.6744 5.73772 13.949L8.60299 11.0837C8.75671 10.93 8.96957 10.8506 9.18642 10.8659C9.40327 10.8813 9.60278 10.9901 9.73324 11.164L11.5657 13.6064L12.6234 12.0207C12.748 11.8338 12.9499 11.7126 13.1735 11.6905C13.3971 11.6684 13.6188 11.7477 13.7776 11.9065L14.7897 12.9186L17.2351 9.40829C17.005 9.01185 16.8732 8.55124 16.8732 8.05986C16.8732 6.57413 18.0777 5.36972 19.5634 5.36972ZM4.30986 15.0141C4.8952 15.0141 5.36972 15.4886 5.36972 16.074C5.36972 16.6593 4.8952 17.1338 4.30986 17.1338C3.72452 17.1338 3.25 16.6593 3.25 16.074C3.25 15.4886 3.72452 15.0141 4.30986 15.0141Z" fill="#currentColor" fillOpacity="0.8"></path></svg>*/}
          {/*  <span>{t.search}</span>*/}
          {/*</li>*/}
        </ul>
      </div>
      {/* Mobile */}
      <>
        <div className='lg:hidden block'>
          <div className='flex-center h-[70px] w-full select-none'>
            <picture>
              <img className='w-[46px]' src="https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.9.55/static/media/icon_zing_mp3_60.f6b51045.svg" alt="" />
            </picture>
          </div>
          <ul className='flex flex-col'>
          <li data-tip={t.charts} onClick={() => setTabActive('charts')} className={twMerge('flex gap-2.5 text-white py-[12px] px-[21px] cursor-pointer hover:bg-[#393142] tooltip tooltip-right', tabActive === 'charts' && 'bg-[#393142]')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M20.25 2C20.25 1.58579 19.9142 1.25 19.5 1.25C19.0858 1.25 18.75 1.58579 18.75 2C18.75 2.95195 18.4626 3.63685 18.0656 4.07478C17.6709 4.51015 17.1258 4.75 16.5 4.75C16.0858 4.75 15.75 5.08579 15.75 5.5C15.75 5.91421 16.0858 6.25 16.5 6.25C17.126 6.25 17.671 6.48996 18.0657 6.9254C18.4628 7.36341 18.75 8.04835 18.75 9C18.75 9.41421 19.0858 9.75 19.5 9.75C19.9142 9.75 20.25 9.41421 20.25 9C20.25 8.04805 20.5374 7.36315 20.9344 6.92522C21.3291 6.48985 21.8742 6.25 22.5 6.25C22.9142 6.25 23.25 5.91421 23.25 5.5C23.25 5.08579 22.9142 4.75 22.5 4.75C21.874 4.75 21.329 4.51004 20.9343 4.0746C20.5372 3.63659 20.25 2.95165 20.25 2ZM19.1769 5.08231C19.2934 4.95373 19.4013 4.81641 19.5 4.6709C19.5987 4.81629 19.7064 4.95351 19.8229 5.082C19.9625 5.23602 20.1129 5.37549 20.2725 5.49999C20.113 5.62441 19.9627 5.76378 19.8231 5.91769C19.7066 6.04627 19.5987 6.18359 19.5 6.3291C19.4013 6.18371 19.2936 6.04649 19.1771 5.918C19.0375 5.76398 18.8871 5.62451 18.7275 5.50001C18.887 5.37559 19.0373 5.23622 19.1769 5.08231ZM13.5095 5.31294C13.5652 5.72339 13.2776 6.10128 12.8672 6.15698L12.3492 6.22728L11.3238 6.36644C10.186 6.55633 9.25 7.65728 9.25 8.74999V18.5C9.25 20.5711 7.57107 22.25 5.5 22.25C3.42893 22.25 1.75 20.5711 1.75 18.5C1.75 16.4289 3.42893 14.75 5.5 14.75C6.3442 14.75 7.12325 15.0289 7.75 15.4997V8.74999C7.75 6.89294 9.25015 5.18376 11.0921 4.88439L11.1116 4.88149L12.1475 4.7409L12.6655 4.67061C13.0759 4.61491 13.4538 4.90249 13.5095 5.31294ZM5.5 16.25C6.74264 16.25 7.75 17.2573 7.75 18.5C7.75 19.7426 6.74264 20.75 5.5 20.75C4.25736 20.75 3.25 19.7426 3.25 18.5C3.25 17.2573 4.25736 16.25 5.5 16.25ZM19.5 11.75C19.9142 11.75 20.25 12.0858 20.25 12.5V17.5C20.25 19.5711 18.5711 21.25 16.5 21.25C14.4289 21.25 12.75 19.5711 12.75 17.5C12.75 15.4289 14.4289 13.75 16.5 13.75C17.3442 13.75 18.1233 14.0289 18.75 14.4997V12.5C18.75 12.0858 19.0858 11.75 19.5 11.75ZM16.5 15.25C17.7426 15.25 18.75 16.2573 18.75 17.5C18.75 18.7426 17.7426 19.75 16.5 19.75C15.2574 19.75 14.25 18.7426 14.25 17.5C14.25 16.2573 15.2574 15.25 16.5 15.25Z" fillOpacity="0.8"></path></svg>
          </li>
          <li data-tip={t.library} onClick={() => setTabActive('library')} className={twMerge('flex gap-2.5 text-white py-[12px] px-[21px] cursor-pointer hover:bg-[#393142] tooltip tooltip-right', tabActive === 'library' && 'bg-[#393142]')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M6.5 2.75C6.08579 2.75 5.75 3.08579 5.75 3.5C5.75 3.91421 6.08579 4.25 6.5 4.25H17.5C17.9142 4.25 18.25 3.91421 18.25 3.5C18.25 3.08579 17.9142 2.75 17.5 2.75H6.5ZM3 9.5C3 7.42893 4.67893 5.75 6.75 5.75H17.25C19.3211 5.75 21 7.42893 21 9.5V17.5C21 19.5711 19.3211 21.25 17.25 21.25H6.75C4.67893 21.25 3 19.5711 3 17.5V9.5ZM6.75 7.25C5.50736 7.25 4.5 8.25736 4.5 9.5V17.5C4.5 18.7426 5.50736 19.75 6.75 19.75H17.25C18.4926 19.75 19.5 18.7426 19.5 17.5V9.5C19.5 8.25736 18.4926 7.25 17.25 7.25H6.75ZM13.666 8.87596C13.4359 8.72253 13.14 8.70823 12.8961 8.83874C12.6522 8.96926 12.5 9.2234 12.5 9.5V13.0499C12.125 12.8581 11.7001 12.75 11.25 12.75C9.73122 12.75 8.5 13.9812 8.5 15.5C8.5 17.0188 9.73122 18.25 11.25 18.25C12.6911 18.25 13.8733 17.1415 13.9905 15.7307C13.9967 15.6916 14 15.6515 14 15.6107V15.5V10.9014L15.084 11.624C15.4286 11.8538 15.8943 11.7607 16.124 11.416C16.3538 11.0714 16.2607 10.6057 15.916 10.376L13.666 8.87596ZM12.5 15.5C12.5 14.8096 11.9404 14.25 11.25 14.25C10.5596 14.25 10 14.8096 10 15.5C10 16.1904 10.5596 16.75 11.25 16.75C11.9404 16.75 12.5 16.1904 12.5 15.5Z" fillOpacity="0.8"></path></svg>
          </li>
          <li data-tip={t.search} onClick={() => setTabActive('search')} className={twMerge('flex gap-2.5 text-white py-[12px] px-[21px] cursor-pointer hover:bg-[#393142] tooltip tooltip-right', tabActive === 'search' && 'bg-[#393142]')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M1.76078 11.5281C2.0086 6.08576 6.49865 1.75 12.0018 1.75C14.0559 1.75 15.971 2.35489 17.5759 3.39648C17.9234 3.62198 18.0222 4.08645 17.7967 4.4339C17.5712 4.78136 17.1068 4.88023 16.7593 4.65473C15.3901 3.76614 13.7574 3.25 12.0018 3.25C7.30422 3.25 3.47074 6.95138 3.25923 11.5963C3.24039 12.0101 2.88968 12.3303 2.47589 12.3114C2.06211 12.2926 1.74194 11.9419 1.76078 11.5281ZM21.5275 11.6871C21.9413 11.7057 22.2617 12.0563 22.243 12.4701C21.998 17.9149 17.5067 22.2536 12.0018 22.2536C9.89696 22.2536 7.93821 21.6184 6.30952 20.5292C5.9652 20.299 5.87274 19.8332 6.103 19.4889C6.33327 19.1446 6.79905 19.0521 7.14337 19.2824C8.53298 20.2117 10.203 20.7536 12.0018 20.7536C16.7009 20.7536 20.5354 17.0497 20.7445 12.4026C20.7632 11.9888 21.1137 11.6685 21.5275 11.6871ZM20.7535 8.05986C20.7535 7.40256 20.2207 6.86972 19.5634 6.86972C18.9061 6.86972 18.3732 7.40256 18.3732 8.05986C18.3732 8.71715 18.9061 9.25 19.5634 9.25C20.2207 9.25 20.7535 8.71715 20.7535 8.05986ZM19.5634 5.36972C21.0491 5.36972 22.2535 6.57413 22.2535 8.05986C22.2535 9.54558 21.0491 10.75 19.5634 10.75C19.1208 10.75 18.7031 10.6431 18.3349 10.4537L15.5083 14.5112C15.3814 14.6933 15.1803 14.8099 14.9592 14.8295C14.738 14.8491 14.5196 14.7698 14.3626 14.6128L13.3637 13.6139L12.2257 15.3202C12.0906 15.5227 11.8658 15.6471 11.6225 15.6538C11.3793 15.6605 11.1478 15.5488 11.0018 15.3542L9.05228 12.7558L6.78385 15.0242C6.75187 15.0562 6.71772 15.0847 6.68188 15.1097C6.80299 15.4073 6.86972 15.7328 6.86972 16.074C6.86972 17.4877 5.72363 18.6338 4.30986 18.6338C2.89609 18.6338 1.75 17.4877 1.75 16.074C1.75 14.6602 2.89609 13.5141 4.30986 13.5141C4.83856 13.5141 5.32983 13.6744 5.73772 13.949L8.60299 11.0837C8.75671 10.93 8.96957 10.8506 9.18642 10.8659C9.40327 10.8813 9.60278 10.9901 9.73324 11.164L11.5657 13.6064L12.6234 12.0207C12.748 11.8338 12.9499 11.7126 13.1735 11.6905C13.3971 11.6684 13.6188 11.7477 13.7776 11.9065L14.7897 12.9186L17.2351 9.40829C17.005 9.01185 16.8732 8.55124 16.8732 8.05986C16.8732 6.57413 18.0777 5.36972 19.5634 5.36972ZM4.30986 15.0141C4.8952 15.0141 5.36972 15.4886 5.36972 16.074C5.36972 16.6593 4.8952 17.1338 4.30986 17.1338C3.72452 17.1338 3.25 16.6593 3.25 16.074C3.25 15.4886 3.72452 15.0141 4.30986 15.0141Z" fill="#currentColor" fillOpacity="0.8"></path></svg>
          </li>
        </ul>
        </div>
      </>
    </div>
  )
}

export default Sidebar