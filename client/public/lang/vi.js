const language = {
  notify: "Thông báo",
  home: {
    tab: {
      profile: {
        title: 'Thông tin của tôi',
        actions: {
          edit: 'Chỉnh sửa thông tin',
        },
        info: {
          about: {
            title: 'Về tôi',
            name: 'Họ và tên',
            email: 'E-mail',
            location: 'Nơi ở',
            phone: "Số điện thoại",
          },
        },
      },
      chat: {
        title: 'Trò chuyện',
        searchHint: 'Tìm kiếm tin nhắn hoặc người dùng',
        recent: 'Gần đây',
      },
      group: {
        title: 'Yêu cầu kết bạn',
        searchHint: 'Tìm kiếm...',
        createGroup: {
          title: 'Tạo nhóm mới',
          groupName: {
            label: 'Tên nhóm',
            hint: 'Nhập tên nhóm',
          },
          groupMember: {
            label: 'Thành viên nhóm',
            hint: 'Nhập thành viên nhóm',
          },
          groupDesc: {
            label: 'Mô tả',
            hint: 'Nhập mô tả',
          },
          closeText: 'Huỷ bỏ',
          submitText: 'Tạo nhóm',
        },
      },
      contact: {
        title: 'Liên lạc',
        searchHint: 'Tìm kiếm người dùng...',
        itemActions: {
          share: 'Chia sẻ',
          block: 'Chặn',
          remove: 'Xoá người dùng',
        },
      },
    },
    sidebar: {
      profile: 'Thông tin',
      chat: 'Trò chuyện',
      pending: 'Yêu cầu kết bạn',
      contact: 'Liên lạc',
      setting: 'Cài đặt',
      darkMode: 'Chế độ sáng tối',
      logout: 'Đăng xuất',
      language: 'Thay đổi ngôn ngữ',
    },
    room: {
      header: {
        audioCall: {
          label: 'Cuộc gọi âm thanh',
          description: 'Bắt đầu cuộc gọi âm thanh',
        },
        videoCall: {
          label: 'Cuộc gọi video',
          description: 'Bắt đầu cuộc gọi video',
        },
        profile: 'Thông tin',
        more: {
          label: 'Nhiều hơn',
          archive: 'Lưu trữ',
          mute: 'Tắt tiếng',
          delete: 'Xoá',
        },
      },
      footer: {
        inputMessageHint: 'Nhập tin nhắn...',
        emoji: 'Biểu cảm',
        attachedFile: 'Tập tin đính kèm',
        attachedImage: 'Hình ảnh kèm theo',
      },
    },
    welcome: 'Chào mừng bạn đến với ứng dụng trò chuyện',
  },
  auth: {
    title: 'Chat app',
    signIn: {
      label: 'Đăng nhập',
      description: 'Đăng nhập để tiếp tục đến ứng dụng trò chuyện',
      subDescription: `Bạn chưa có tài khoản ?`,
    },
    signUp: {
      label: 'Đăng ký',
      description: 'Đăng ký để tiếp tục đến ứng dụng trò chuyện',
      subDescription: `Bạn đã có tài khoản ?`,
    },
    rememberMe: 'Lưu tài khoản',
    email: {
      label: 'Email',
      hint: 'email@gmail.com',
    },
    password: {
      label: 'Mật khẩu',
      hint: 'Nhập mật khẩu',
    },
    confirmPassword: {
      label: 'Nhập lại mật khẩu',
      hint: 'Nhập lại mật khẩu',
    },
    or: 'Hoặc',
    loginGoogle: 'Đăng nhập với google',
    firstName: {
      label: 'Họ',
      hint: 'Họ',
    },
    lastName: {
      label: 'Tên',
      hint: 'Tên',
    },
  },
  settings: 'Cài đặt',
  saveChanges: 'Lưu thay đổi',
  accept: 'Chấp nhận',
  reject: 'Từ chối',
  confirm: 'Xác nhận',
  close: 'Đóng',
  requestFriend: 'Yêu cầu kết bạn',
  messageRejectRequestFriend: 'Bạn muốn từ chối yêu cầu kết bạn ?',
  messageAcceptRequestSuccess: "Chấp nhận yêu cầu kết bạn thành công",
  friend: "Bạn bè",
  messageCancelFriend: "Bạn muốn huỷ kết bạn ?",
};

export default language;