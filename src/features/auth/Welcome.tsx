import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useTitle from '../../hooks/useTitle';

const Welcome: React.FC = () => {
    const { username, isAdmin } = useAuth();

    useTitle('Welcome');

    const date: Date = new Date();
    const today: string = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'long'
    }).format(date);

    const content: JSX.Element = (
        <section className="welcome">
            <p>{today}</p>
            <h1>Welcome {username}!</h1>
            {isAdmin && <p><Link to="/dash/users">View Users</Link></p>}
            <p><Link to="/dash/settings">View Settings</Link></p>
            <p><Link to="/dash/movies">View Movies</Link></p>
            {/* 
            <p><Link to="/dash/notes">View techNotes</Link></p>
            <p><Link to="/dash/notes/new">Add New techNote</Link></p>
            {(isManager || isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}
            {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}
            */}
        </section>
    );

    return content;
};

export default Welcome;
