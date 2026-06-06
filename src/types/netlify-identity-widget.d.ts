declare module 'netlify-identity-widget' {
  interface User {
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  }

  interface Identity {
    init: (options: any) => void;
    open: (mode?: string) => Promise<User | null>;
    logout: () => Promise<void>;
    currentUser: () => User | null;
  }

  const NetlifyIdentity: Identity;
  export default NetlifyIdentity;
}
