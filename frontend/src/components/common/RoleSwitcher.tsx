import { useEffect, useState } from "react";
import { UserRole, UserRoleText, type UserRole as Role } from "../../constants/UserRole";
import { getCurrentUser, setCurrentUser, subscribeCurrentUser } from "../../api/currentUser";

// 角色切换器：驱动路由守卫式显隐——专家才能看到批准/驳回按钮。
export function RoleSwitcher() {
  const [role, setRole] = useState<Role>(getCurrentUser().role);
  const [name, setName] = useState<string>(getCurrentUser().name);

  useEffect(() => {
    const unsubscribe = subscribeCurrentUser(() => {
      setRole(getCurrentUser().role);
      setName(getCurrentUser().name);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="role-switcher">
      <label>
        当前角色
        <select
          value={role}
          onChange={(event) => {
            const nextRole = event.target.value as Role;
            setCurrentUser({
              ...getCurrentUser(),
              role: nextRole,
              name: nextRole === "EXPERT" ? "专家乙" : "修复师甲"
            });
          }}
        >
          {UserRole.map((value) => (
            <option key={value} value={value}>
              {UserRoleText[value]}
            </option>
          ))}
        </select>
      </label>
      <span className="role-switcher-name">
        {UserRoleText[role]} · {name}
      </span>
    </div>
  );
}
