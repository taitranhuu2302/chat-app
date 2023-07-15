"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Modals_1 = require("@/components/Modals");
var useTranslate_1 = require("@/hooks/useTranslate");
var UserService_1 = require("@/service/UserService");
var ArrayUtils_1 = require("@/utils/ArrayUtils");
var react_1 = require("react");
var AuthContext_1 = require("contexts/AuthContext");
var react_select_1 = require("react-select");
var DarkModeProvider_1 = require("contexts/DarkModeProvider");
var ConversationService_1 = require("@/service/ConversationService");
var react_hot_toast_1 = require("react-hot-toast");
var ErrorUtils_1 = require("@/utils/ErrorUtils");
var react_query_1 = require("react-query");
var Api_1 = require("@/constants/Api");
var colorStyles = {
    control: function (styles) { return (__assign(__assign({}, styles), { backgroundColor: '#36404A' })); },
    option: function (styles, _a) {
        var data = _a.data, isDisabled = _a.isDisabled, isFocused = _a.isFocused, isSelected = _a.isSelected;
        return __assign(__assign({}, styles), { backgroundColor: '#36404A', ':active': __assign(__assign({}, styles[':active']), { backgroundColor: '#303841' }) });
    },
    multiValue: function (styles, _a) {
        var data = _a.data;
        return __assign(__assign({}, styles), { backgroundColor: '#303841' });
    },
    multiValueLabel: function (styles, _a) {
        var data = _a.data;
        return (__assign(__assign({}, styles), { color: 'white' }));
    },
    multiValueRemove: function (styles, _a) {
        var data = _a.data;
        return (__assign(__assign({}, styles), { color: 'white', ':hover': {
                backgroundColor: '#303841',
                color: 'white'
            } }));
    }
};
var AddNewMember = function (_a) {
    var open = _a.open, onClose = _a.onClose, conversation = _a.conversation;
    var t = useTranslate_1["default"]();
    var _b = react_1.useState(10), totalFriends = _b[0], setTotalFriends = _b[1];
    var _c = react_1.useState([]), friends = _c[0], setFriends = _c[1];
    var _d = react_1.useState(false), isGetFriends = _d[0], setIsGetFriends = _d[1];
    var auth = react_1.useContext(AuthContext_1.AuthContext).auth;
    var _e = react_1.useState([]), members = _e[0], setMembers = _e[1];
    var theme = react_1.useContext(DarkModeProvider_1.DarkModeContext).theme;
    var _f = ConversationService_1.useAddMemberToConversation(), addMemberAsync = _f.mutateAsync, addMemberLoading = _f.isLoading;
    var queryClient = react_query_1.useQueryClient();
    var _g = UserService_1.useGetFriendByUser({
        options: {
            onSuccess: function (data) {
                setFriends(ArrayUtils_1.flatMapObjectInfinite(data).map(function (item) { return item.friend; }));
            }
        },
        id: auth === null || auth === void 0 ? void 0 : auth._id,
        limit: totalFriends
    }), friendData = _g.data, refetch = _g.refetch;
    react_1.useEffect(function () {
        if (!isGetFriends) {
            var total = friendData === null || friendData === void 0 ? void 0 : friendData.pages[0].data.meta.total;
            setTotalFriends(total);
            refetch();
            setIsGetFriends(true);
        }
    }, [friendData]);
    var onChangeSelect = function (selectOptions) {
        setMembers(__spreadArrays(selectOptions));
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, e_1, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    payload = {
                        conversationId: conversation._id,
                        members: members.map(function (item) { return item.value; })
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, addMemberAsync(payload)];
                case 2:
                    _a.sent();
                    react_hot_toast_1["default"].success("Add member success");
                    return [4 /*yield*/, queryClient.refetchQueries([Api_1.API.CONVERSATION.FIND_BY_ID])];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    errors = ErrorUtils_1.getErrorResponse(e_1.message);
                    react_hot_toast_1["default"].error(errors[0]);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(Modals_1["default"], { open: open, onClose: onClose, title: t.addNewMember, isButtonClose: true },
        react_1["default"].createElement("form", { className: 'flex flex-col gap-2.5 h-full', onSubmit: handleSubmit },
            react_1["default"].createElement("div", { className: 'flex flex-col gap-2.5' },
                react_1["default"].createElement("label", { htmlFor: 'group-members', className: 'text-md' }, t.newMember),
                react_1["default"].createElement(react_select_1["default"], { isMulti: true, id: 'group-members', options: friends.map(function (friend) { return ({ label: friend.firstName + " " + friend.lastName, value: friend._id }); }), className: 'select-custom', value: members, placeholder: t.newMember, classNamePrefix: "select", onChange: onChangeSelect, styles: theme === 'dark' ? colorStyles : {} })),
            react_1["default"].createElement("div", { className: 'modal-action flex-grow' },
                react_1["default"].createElement("button", { type: 'button', onClick: onClose, className: 'btn btn-md btn-error' }, t.home.tab.group.createGroup.closeText),
                react_1["default"].createElement("button", { disabled: addMemberLoading, type: 'submit', className: 'btn btn-primary' }, addMemberLoading ? (react_1["default"].createElement("span", { className: "loading loading-spinner loading-sm" })) : (react_1["default"].createElement("span", null, t.saveChanges)))))));
};
exports["default"] = AddNewMember;
