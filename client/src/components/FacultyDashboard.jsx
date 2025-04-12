// import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// import Sidebar from './faculty/Sidebar';
// import Dashboard from './faculty/Dashboard';
// import ViewAllBooks from './faculty/ViewAllBooks';
// import SearchBook from './faculty/SearchBook';
// import MyIssuedBooks from './faculty/MyIssuedBooks';
// import DueReminders from './faculty/DueReminders';
// import ExploreArchives from './faculty/ExploreArchives';
// import EditProfile from './faculty/EditProfile';
// import Settings from './faculty/Settings';
// import Header from './Header';

// const FacultyDashboard = () => {
//     const [activeFeature, setActiveFeature] = useState('🏠 Dashboard');
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state

//     const features = [
//         { name: '🏠 Dashboard', component: <Dashboard /> },
//         { name: '📘 View All Books', component: <ViewAllBooks /> },
//         { name: '📄 My Issued Books', component: <MyIssuedBooks /> },
//         { name: '⏰ Due Reminders', component: <DueReminders /> },
//         { name: '📁 Explore Archives', component: <ExploreArchives /> },
//         { name: '⚙️ Settings', component: <Settings /> },
//     ];

//     const handleFeatureChange = (featureName) => {
//         setActiveFeature(featureName);

//         // Automatically close the sidebar when "View All Books" is selected
//         if (featureName === '📘 View All Books') {
//             setIsSidebarOpen(false);
//         } else {
//             setIsSidebarOpen(true);
//         }
//     };

//     const renderFeature = () => {
//         const feature = features.find((f) => f.name === activeFeature);
//         return feature?.component || null;
//     };

//     return (
//         <div className="flex flex-col min-h-screen bg-gray-100">
//             {/* Header */}
//             <Header
//                 isSidebarOpen={isSidebarOpen}
//                 setIsSidebarOpen={setIsSidebarOpen}
//             />

//             <div className="flex flex-1">
//                 {/* Sidebar */}
//                 {isSidebarOpen && (
//                     <Sidebar
//                         features={features}
//                         activeFeature={activeFeature}
//                         setActiveFeature={handleFeatureChange}
//                     />
//                 )}

//                 {/* Main Content */}
//                 <div
//                     className={`p-8 transition-all duration-300 ${
//                         isSidebarOpen ? 'w-3/4' : 'w-full'
//                     }`}
//                 >
//                     {renderFeature()}
//                 </div>
//             </div>

//             {/* Footer */}
//             <footer className="bg-gray-800 text-white p-4 text-center">
//                 <p>&copy; 2025 BookBase. All rights reserved.</p>
//             </footer>
//         </div>
//     );
// };

// export default FacultyDashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './faculty/Sidebar';
import Dashboard from './faculty/Dashboard';
import ViewAllBooks from './faculty/ViewAllBooks';
//import SearchBook from './faculty/SearchBook';
import MyIssuedBooks from './faculty/MyIssuedBooks';
import DueReminders from './faculty/DueReminders';
import ExploreArchives from './faculty/ExploreArchives';
//import EditProfile from './faculty/EditProfile';
import Settings from './faculty/Settings';
import Header from './Header';

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState('🏠 Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const features = [
        { name: '🏠 Dashboard', component: <Dashboard /> },
        { name: '📘 View All Books', component: <ViewAllBooks /> },
        
        { name: '📄 My Issued Books', component: <MyIssuedBooks /> },
        { name: '⏰ Due Reminders', component: <DueReminders /> },
        { name: '📁 Explore Archives', component: <ExploreArchives /> },
      
        { name: '⚙️ Settings', component: <Settings /> },
       
    ];

    const handleFeatureChange = (featureName) => {
        setActiveFeature(featureName);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderFeature = () => {
        const feature = features.find((f) => f.name === activeFeature);
        return feature?.component || null;
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <Header
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="flex flex-1">
                {/* Sidebar */}
                {isSidebarOpen && (
                    <Sidebar
                        features={features}
                        activeFeature={activeFeature}
                        setActiveFeature={handleFeatureChange}
                        handleLogout={handleLogout}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                )}

                {/* Main Content */}
                <div
                    className={`p-8 transition-all duration-300 ${
                        isSidebarOpen ? 'w-full md:w-3/4 lg:w-4/5' : 'w-full'
                    } overflow-auto`}
                >
                    {renderFeature()}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>&copy; 2025 BookBase. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default FacultyDashboard;