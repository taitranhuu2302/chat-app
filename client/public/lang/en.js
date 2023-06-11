const language = {
    home: {
        tab: {
            profile: {
                title: 'My Profile',
                actions: {
                    edit: 'Edit Profile',
                },
                info: {
                    about: {
                        title: 'About',
                        name: 'Name',
                        email: 'Email',
                        location: 'Location',
                    },
                },
            },
            chat: {
                title: 'Chats',
                searchHint: 'Search messages or users',
                recent: 'Recent',
            },
            group: {
                title: 'Groups',
                searchHint: 'Search groups...',
                createGroup: {
                    title: 'Create New Group',
                    groupName: {
                        label: 'Group Name',
                        hint: 'Enter Group Name',
                    },
                    groupMember: {
                        label: 'Group Members',
                        hint: 'Enter Group Members',
                    },
                    groupDesc: {
                        label: 'Description',
                        hint: 'Enter Description',
                    },
                    closeText: 'Close',
                    submitText: 'Create Group',
                },
            },
            contact: {
                title: 'Contacts',
                searchHint: 'Search users...',
                itemActions: {
                    share: 'Share',
                    block: 'Block',
                    remove: 'Remove',
                },
            },
        },
        sidebar: {
            profile: 'Profile',
            chat: 'Chats',
            group: 'Groups',
            contact: 'Contacts',
            setting: 'Settings',
            darkMode: 'Dark / Light Mode',
            logout: 'Logout',
            language: 'Change Language'
        },
        room: {
            header: {
                audioCall: {
                    label: 'Audio Call',
                    description: 'Start Audio Call'
                },
                videoCall: {
                    label: 'Video Call',
                    description: 'Start Video Call'
                },
                profile: 'Profile',
                more: {
                    label: 'More',
                    archive: 'Archive',
                    mute: 'Muted',
                    delete: 'Delete'
                },
            },
            footer: {
                inputMessageHint: 'Enter Message...',
                emoji: 'Emoji',
                attachedFile: 'Attached File',
                attachedImage: 'Images'
            }
        },
        welcome: 'Welcome to chat app',
    },
    auth: {
        title: 'Chat app',
        signIn: {
            label: 'Sign In',
            description: 'Sign in to continue to chat app',
            subDescription: `Don't have an account ?`,
        },
        signUp: {
            label: 'Sign Up',
            description: 'Sign up to continue to chat app',
            subDescription: `Already have an account ?`,
        },
        rememberMe: 'Remember Me',
        email: {
            label: 'Email',
            hint: 'email@gmail.com'
        },
        password: {
            label: 'Password',
            hint: 'Enter Password'
        },
        confirmPassword: {
            label: 'Confirm Password',
            hint: 'Enter Confirm Password'
        },
        or: "or",
        loginGoogle: "Login with google"
    },
};

export default language;