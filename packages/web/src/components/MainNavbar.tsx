import { Login } from '@lib/auth';
import firebase from 'firebase';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from './Button';
import { NavItem } from './NavItem';

export const Navbar: React.FC = () => {
  const [isOn, toggleIsOn] = useState(false);
  const [user] = useAuthState(firebase.auth());
  const router = useRouter();

  return (
    <>
      <nav className="hidden sm:flex items-center justify-between p-8 bg-gray-800 ">
        <div className="flex justify-items-start items-center space-x-5">
          <img src="/static/oasis-logo.png" alt="Oasis Logo" className="w-28" />
          <NavItem name="Home" href="#" mobile={false} />
          <NavItem name="Topics" href="#" mobile={false} />
          <NavItem name="Friends" href="#" mobile={false} />
          <NavItem name="Saved" href="#" mobile={false} />
        </div>
        <div className="flex justify-items-start items-center space-x-6 ml-4">
          <div className="flex items-center relative">
            <img src="/static/magnifying-glass.svg" className="absolute ml-3" />
            <input
              placeholder="Search"
              className="rounded-lg bg-gray-700 h-10 text-sm pl-11 text-gray-300 w-40 lg:w-80"
            />
          </div>
          <img src="/static/Bell.svg" />
          {user && (
            <img
              src={user?.photoURL ?? undefined}
              alt={user?.displayName ?? undefined}
              className="w-12 h-12 rounded-full"
            />
          )}
          {user ? (
            <img src="/static/Down-Arrow.svg" />
          ) : (
            <Button
              size="sm"
              onClick={async () => {
                await Login();
              }}
            >
              Login
            </Button>
          )}
        </div>
      </nav>

      {/*mobile navbar*/}
      <nav className="max-w-full mx-auto p-8 sm:hidden">
        <div className="flex items-center justify-between">
          <img src="/static/oasis-logo.png" alt="Oasis Logo" className="w-28" />
          <div className="flex items-center space-x-6 md:space-x-10 text-lg text-gray-300">
            <img src="/static/Search.svg" />
            <img src="/static/Bell.svg" />

            {user ? (
              <img
                onClick={() => {
                  toggleIsOn(!isOn);
                }}
                src={user?.photoURL ?? undefined}
                alt={user?.displayName ?? undefined}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  await Login();
                }}
              >
                Login
              </Button>
            )}
          </div>
        </div>

        <div
          className={`flex rounded-lg justify-end bg-gray-700 float-right px-3 py-2 mt-2 max-w-md ${
            isOn ? 'animate-fade-in-down' : 'opacity-0 animate-fade-out-up'
          }`}
        >
          <div className="flex items-center space-x-6 md:space-x-10 text-base text-gray-300">
            <NavItem name="Feed" href="#" mobile={true} />

            <NavItem name="Followers" href="#" mobile={true} />
            <NavItem
              name="Logout"
              onClick={() => {
                firebase.auth().signOut();
                router.push('/');
              }}
              mobile={true}
            />

            <Button size="sm">Post</Button>
          </div>
        </div>
      </nav>
    </>
  );
};
