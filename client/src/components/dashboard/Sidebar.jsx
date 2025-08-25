import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../../context/AppContext";

const Sidebar = () => {
    const { user } = useAppContext();

    const roleRank = { default: 1, moderator: 2, admin: 3 };
    const currentRank = roleRank[user?.role] || 0;

    // Menu config
    const menuItems = [
        { to: "/dashboard", icon: assets.home_icon, label: "Dashboard", minRole: 1 },
        { to: "/dashboard/request/blog/add", icon: assets.add_icon, label: "Blog Requests", minRole: 1, maxRole: 2 },
        { to: "/dashboard/request/blog/list", icon: assets.list_icon, label: "Blog lists", minRole: 1, maxRole: 2 },
        { to: "/dashboard/post/blog", icon: assets.add_icon, label: "Add blogs", minRole: 3 },
        { to: "/dashboard/list/blog", icon: assets.list_icon, label: "Blog lists", minRole: 3 },
        { to: "/dashboard/approve/blog", icon: assets.tick_icon, label: "Blog Requests", minRole: 3 },
        { to: "/dashboard/post/notice", icon: assets.add_icon, label: "Add Notice", minRole: 3 },
        { to: "/dashboard/list/notice", icon: assets.noticeboard_icon, label: "Notices", minRole: 2 },
        { to: "/dashboard/comments/blog", icon: assets.comment_icon, label: "Comments", minRole: 1 },
        { to: "/dashboard/users/search", icon: assets.user_icon, label: "Users", minRole: 2 },
    ];

    return (
        <div className="flex flex-col border-r border-gray-200 min-h-full pt-6">
            {menuItems
                .filter(item =>
                    currentRank >= item.minRole &&
                    (item.maxRole ? currentRank <= item.maxRole : true)
                )
                .map(({ to, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/dashboard"} 
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive ? "bg-primary/10 border-r-4 border-primary" : ""
                            }`
                        }
                    >
                        <img src={icon} alt="" className="min-w-4 w-5" />
                        <p className="hidden md:inline-block">{label}</p>
                    </NavLink>
                ))}
        </div>
    );
};

export default Sidebar;
