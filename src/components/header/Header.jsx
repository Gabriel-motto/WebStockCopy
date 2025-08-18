import "./Header.css";
import { CollapsedSidebar } from "@/components/sidebar/Sidebar";

// function UserAvatar({ handleClick }) {
//     return (
//         <Menu.Root>
//             <Menu.Trigger asChild>
//                 <Button variant="plain">
//                     <Stack gap="8">
//                         {users.map((user) => (
//                             <HStack
//                                 key={user.email}
//                                 gap="4"
//                             >
//                                 <Avatar.Root>
//                                     <Avatar.Fallback name={user.name} />
//                                     <Avatar.Image src={user.avatar} />
//                                 </Avatar.Root>
//                                 <Stack gap="0">
//                                     <Text fontWeight="medium">{user.name}</Text>
//                                     <Text
//                                         color="fg.muted"
//                                         textStyle="sm"
//                                     >
//                                         {user.email}
//                                     </Text>
//                                 </Stack>
//                             </HStack>
//                         ))}
//                     </Stack>
//                 </Button>
//             </Menu.Trigger>
//             <Portal>
//                 <Menu.Positioner>
//                     <Menu.Content>
//                         <Menu.Item value="Profile">Mi perfil</Menu.Item>
//                         <Menu.Item value="Settings">Configuración</Menu.Item>
//                         <Menu.Separator />
//                         <Menu.Item value="Logout">
//                             <button onClick={handleClick}>Cerrar sesión</button>
//                         </Menu.Item>
//                     </Menu.Content>
//                 </Menu.Positioner>
//             </Portal>
//         </Menu.Root>
//     );
// }

// const users = [
//     {
//         id: "1",
//         name: "Gabriel Motto",
//         email: "gabriel.motto@gkn.com",
//     },
// ];

export default function Header() {
    // const [isLogin, setIsLogin] = useState(false);

    // const handleClick = () => {
    //     setIsLogin(!isLogin);
    // };

    return (
        <div className="header-content">
            <img
                src="/assets/GNK_logo_blanco.png"
                alt="GNK logo png sin fondo azul"
                className="header-logo"
            />
            {/* <div className="header-login">
                {isLogin ? (
                    <UserAvatar handleClick={handleClick} />
                ) : (
                    <Button
                        variant="plain"
                        onClick={handleClick}
                    >
                        <IoPersonOutline />
                        Login
                    </Button>
                )}
            </div> */}

            <div className="burger-menu">
                <CollapsedSidebar />
            </div>
        </div>
    );
}
