"use strict";
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
exports.__esModule = true;
var Input_1 = require("@/components/Input");
var Modals_1 = require("@/components/Modals");
var Api_1 = require("@/constants/Api");
var useTranslate_1 = require("@/hooks/useTranslate");
var ConversationService_1 = require("@/service/ConversationService");
var ErrorUtils_1 = require("@/utils/ErrorUtils");
var react_1 = require("react");
var react_hot_toast_1 = require("react-hot-toast");
var react_query_1 = require("react-query");
var UpdateRoomName = function (_a) {
    var open = _a.open, onClose = _a.onClose, conversation = _a.conversation;
    var t = useTranslate_1["default"]();
    var _b = react_1.useState(conversation.conversationName), chatName = _b[0], setChatName = _b[1];
    var _c = ConversationService_1.useUpdateConversationApi({}), mutateAsync = _c.mutateAsync, isLoading = _c.isLoading;
    var queryClient = react_query_1.useQueryClient();
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var e_1, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!chatName)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, mutateAsync({
                            id: conversation._id,
                            data: { conversationName: chatName }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, queryClient.refetchQueries([Api_1.API.CONVERSATION.FIND_ALL_BY_USER])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, queryClient.refetchQueries([Api_1.API.CONVERSATION.FIND_BY_ID])];
                case 4:
                    _a.sent();
                    react_hot_toast_1.toast.success("Update conversation success");
                    onClose();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    errors = ErrorUtils_1.getErrorResponse(e_1.message);
                    react_hot_toast_1.toast.error(errors[0]);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(Modals_1["default"], { open: open, onClose: onClose, title: t.changeChatName, isButtonClose: true },
        react_1["default"].createElement("form", { onSubmit: handleSubmit },
            react_1["default"].createElement(Input_1["default"], { className: "border outline-none rounded bg-transparent dark:border-night-500", label: 'Chat Name', placeholder: 'New name', value: chatName, onChange: function (value) { return setChatName(value); } }),
            react_1["default"].createElement("button", { type: 'submit', disabled: !chatName || isLoading, className: "btn-custom" }, isLoading ? react_1["default"].createElement("span", { className: "loading loading-spinner loading-md" }) : react_1["default"].createElement("span", null, t.saveChanges)))));
};
exports["default"] = UpdateRoomName;
