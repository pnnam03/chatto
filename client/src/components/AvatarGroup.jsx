import Avatar from "@mui/material/Avatar";
import { GroupAvatar } from "../libs/badgeAvatar.jsx";
import { stringAvatar } from "../libs/stringAvatar.jsx";
import useUserStore from "../stores/userStore.js";

const AvatarGroup = ({ channel }) => {
  const { user } = useUserStore();
  const members = channel?.members
    ?.filter((member) => member.id !== user?.id)
    .slice(0, 2);
  return (
    <>
      {members?.length === 0 ? (
        <Avatar {...stringAvatar(`${user?.firstName} ${user?.lastName}`)} />
      ) : null}
      {members?.length === 1 ? (
        <Avatar
          {...stringAvatar(`${members[0]?.firstName} ${members[0]?.lastName}`)}
        />
      ) : null}
      {members?.length === 2 ? (
        <GroupAvatar memberA={members[0]} memberB={members[1]} />
      ) : null}
    </>
  );
};

export default AvatarGroup;
