import './App.css';

import {Routes , Route} from 'react-router-dom'

import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import Login from './components/Login'
import HomePage from './components/HomePage';
import EditProfile from './components/EditProfile';
import AddJob from './components/AddJob'
import NotFoundPage from './components/NotFoundPage';
import JobsOffered from './components/JobsOffered';
import JobsApplied from './components/JobsApplied';
import SearchJob from './components/SearchJob';
import ViewApplication from './components/ViewApplication';
import SingleJobApplications from './components/SingleJobApplications';
import JoinMeeting from './components/meeting/JoinMeeting';
import Meeting from './components/meeting/Meeting';

import { useUser } from './providers/userContext';
import { Box } from '@chakra-ui/react';
import ChatPage from './components/Chats/ChatPage';

function App() {
    const {user} = useUser();

    return (
        <Box className='App'>
            <Navbar />
            <Routes>
                <Route exact path = "/" element={<HomePage />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route exact path ="/login" element={<Login />} />
                <Route exact path ="/editprofile" element={<EditProfile />} />
                {(user && user.profession === 'Recruiter') ? <Route exact path ='/addjob' element={<AddJob />} /> : <Route path='/addjob' element = {<NotFoundPage />} />}
                {(user && user.profession === 'Recruiter') ? <Route exact path ='/jobsoffered' element={<JobsOffered />} /> : <Route path='/jobsoffered' element = {<NotFoundPage />} />}
                {(user && user.profession === 'Student') ? <Route exact path ='/applications' element={<JobsApplied />} /> : <Route path='/applications' element = {<NotFoundPage />} />}
                {(user && user.profession === 'Student') ? <Route exact path ='/jobs/:jobTitle' element={<SearchJob />} /> : <Route path='/jobs/:jobTitle' element = {<NotFoundPage />} />}
                {(user && user.profession === 'Recruiter') ? <Route exact path ='/:appId/view' element={<ViewApplication />} /> : <Route path='/:appId/view' element = {<NotFoundPage />} />}
                {(user && user.profession === 'Recruiter') ? <Route exact path ='/:jobId/applications' element={<SingleJobApplications />} /> : <Route path='/:jobId/applications' element = {<SingleJobApplications />} />}
                <Route exact path="/chats" element={<ChatPage />} />
                <Route exact path="/joinmeeting" element={<JoinMeeting />} />
                <Route exact path="/meeting/:meetId" element={<Meeting />} />
            </Routes>
        </Box>
    );
}

export default App;
