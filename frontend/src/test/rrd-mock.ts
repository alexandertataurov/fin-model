// Minimal mock for react-router-dom used in unit tests
export const useNavigate = () => () => { };
export const Link = (props: any) => props.children;
export const NavLink = (props: any) => props.children;
export const BrowserRouter = (props: any) => props.children;
export const MemoryRouter = (props: any) => props.children;
export default {} as any;

