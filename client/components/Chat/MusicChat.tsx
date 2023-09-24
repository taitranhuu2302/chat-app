import React from "react";
import Marquee from "react-fast-marquee";

const MusicChat = () => {
  return <div className="bg-white shadow-xl border dark:border-via-200 mx-2.5 mt-2.5 rounded-3xl p-2.5 dark:bg-via-200">
    <div className="flex items-center gap-2.5">
      <picture className="w-fit">
        <img className="w-[50px] rounded-full rotateLoading" src="https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/d/e/9/f/de9f1c361a7309d62e6c4fca8351d4b6.jpg" alt="" />
      </picture>
      <div className="max-w-[250px] w-full">
        <Marquee pauseOnHover>
          <p className="text-sm">
            Một ngày - Huỳnh Công Hiếu
          </p>
        </Marquee>
      </div>
    </div>
  </div>;
};

export default MusicChat;
