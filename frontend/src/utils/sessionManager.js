// frontend/src/utils/sessionManager.js

const KEY_CURRENT_SESSION = "savms_current_session";
const KEY_ANON_USER_ID    = "savms_anon_user_id";

// 生成 ID（优先用 UUID）
function genId(prefix = "sid") {
    const id =
        (typeof crypto !== "undefined" && crypto.randomUUID)
            ? crypto.randomUUID()
            : (Date.now() + "-" + Math.random().toString(16).slice(2));
    return `${prefix}_${id}`;
}

// 确保有一个当前会话 ID（若没有就创建并保存）
function getCurrentSessionId() {
    let id = localStorage.getItem(KEY_CURRENT_SESSION);
    if (!id) {
        id = genId("sid");
        localStorage.setItem(KEY_CURRENT_SESSION, id);
    }
    return id;
}

function setCurrentSessionId(id) {
    if (id) localStorage.setItem(KEY_CURRENT_SESSION, id);
}

// 从 UserContext 提取用户 ID；若没有则给一个“匿名”ID并持久化
function getUserId(userContext) {
    // 尽量适配几种常见形状
    const uc = userContext || {};
    const candidate =
        uc.user?.id ||
        uc.user?.userId ||
        uc.userId ||
        uc.id ||
        uc.username ||
        uc.email;

    if (candidate) return String(candidate);

    // 走匿名用户
    let anon = localStorage.getItem(KEY_ANON_USER_ID);
    if (!anon) {
        anon = genId("anon");
        localStorage.setItem(KEY_ANON_USER_ID, anon);
    }
    return anon;
}

// （可选）清理本地缓存，调试用
function resetAll() {
    localStorage.removeItem(KEY_CURRENT_SESSION);
    localStorage.removeItem(KEY_ANON_USER_ID);
}

const SessionManager = {
    getCurrentSessionId,
    setCurrentSessionId,
    getUserId,
    resetAll,
};

export default SessionManager;
