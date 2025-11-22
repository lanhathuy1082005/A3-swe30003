export function requirePermission(perm) {
    return (req, res, next) => {
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ message: "Not logged in" });
        }

        if (!user.permissions.includes(perm)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
}
    