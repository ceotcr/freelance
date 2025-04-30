export interface IUser {
    id: string;
    username: string;
    role: 'admin' | 'client' | 'freelancer';
    email: string;
    firstName: string;
    lastName: string;
    bio?: string;
    profilePicture?: string;
    "projects": [],
    "bids": [],
    "messages": [],
    "files": [],
    "invoices": [],
    "skills": { id: number; name: string }[]
}