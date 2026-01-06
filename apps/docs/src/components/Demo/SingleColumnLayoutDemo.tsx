

// import React from 'react';
// import { SingleColumnLayout } from '@site/src/components/UI/single-column-layout';
// import Tabs from '@theme/Tabs';
// import TabItem from '@theme/TabItem';
// import CodeBlock from '@theme/CodeBlock';
// import { Card } from '@site/src/components/UI/card';

// const SingleColumnLayoutDemo = () => {
//     const handleNavClick = (href: string, label: string) => {
//         console.log(`Navigating to ${label}: ${href}`);
//     };

//     const handleSignIn = () => {
//         console.log("Sign in clicked");
//     };

//     const handleSignUp = () => {
//         console.log("Sign up clicked");
//     };

//     const mainContent = (
//         <div className="space-y-8">
//             <div className="text-center py-8">
//                 <h1 className="text-4xl font-bold mb-4">Single Column Layout Demo</h1>
//                 <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//                     A clean, responsive layout perfect for marketing pages, documentation sites,
//                     and applications that need a simple yet powerful layout solution.
//                 </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
//                 <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
//                     <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                         <span className="text-blue-600 text-xl font-bold">1</span>
//                     </div>
//                     <h3 className="font-semibold text-lg mb-2">Responsive Design</h3>
//                     <p className="text-sm text-muted-foreground">
//                         Optimized for all screen sizes with mobile-first approach
//                     </p>
//                 </Card>

//                 <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
//                     <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                         <span className="text-green-600 text-xl font-bold">2</span>
//                     </div>
//                     <h3 className="font-semibold text-lg mb-2">Multiple Variants</h3>
//                     <p className="text-sm text-muted-foreground">
//                         Choose from 8 different theme variants to match your brand
//                     </p>
//                 </Card>

//                 <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
//                     <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                         <span className="text-purple-600 text-xl font-bold">3</span>
//                     </div>
//                     <h3 className="font-semibold text-lg mb-2">Smooth Animations</h3>
//                     <p className="text-sm text-muted-foreground">
//                         Beautiful entrance animations for enhanced user experience
//                     </p>
//                 </Card>
//             </div>
//         </div>
//     );

//     const codeString = `import React from 'react';
// import { SingleColumnLayout } from './components/single-column-layout';

// function App() {
//     const handleNavClick = (href: string, label: string) => {
//         console.log(\`Navigating to \${label}: \${href}\`);
//     };

//     const handleSignIn = () => {
//         console.log("Sign in clicked");
//     };

//     const handleSignUp = () => {
//         console.log("Sign up clicked");
//     };

//     const mainContent = (
//         <div className="space-y-8">
//             <div className="text-center py-8">
//                 <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
//                 <p className="text-lg text-muted-foreground">
//                     A clean, modern layout for your application
//                 </p>
//             </div>
//         </div>
//     );

//     return (
//         <SingleColumnLayout
//             variant="default"
//             animation="fade"
//             stickyHeader={true}
//             stickyFooter={false}
//             onNavLinkClick={handleNavClick}
//             onSignInClick={handleSignIn}
//             onSignUpClick={handleSignUp}
//             children={mainContent}
//             activeNavLink="#"
//         />
//     );
// }

// export default App;`;

//     return (
//         <div className="space-y-6 mb-8">
//             <Tabs>
//                 <TabItem value="preview" label="Preview" default>
//                     <div className="p-4 border rounded-lg">
//                         <div className="h-[600px] overflow-y-auto rounded-lg overflow-hidden shadow-lg">
//                             <SingleColumnLayout
//                                 variant="default"
//                                 animation="fade"
//                                 stickyHeader={true}
//                                 stickyFooter={false}
//                                 onNavLinkClick={handleNavClick}
//                                 onSignInClick={handleSignIn}
//                                 onSignUpClick={handleSignUp}
//                                 children={mainContent}
//                                 activeNavLink="#"
//                             />
//                         </div>
//                     </div>
//                 </TabItem>

//                 <TabItem value="code" label="Code">
//                     <div className="p-4 border rounded-lg">
//                         <CodeBlock language="tsx" className="text-sm">
//                             {codeString}
//                         </CodeBlock>
//                     </div>
//                 </TabItem>
//             </Tabs>
//         </div>
//     );
// };

// export default SingleColumnLayoutDemo;

import React from 'react';
import { SingleColumnLayout } from '@site/src/components/UI/single-column-layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Card } from '@site/src/components/UI/card';

const SingleColumnLayoutDemo = () => {
    const handleNavClick = (href: string, label: string) => {
        console.log(`Navigating to ${label}: ${href}`);
    };

    const handleSignIn = () => {
        console.log("Sign in clicked");
    };

    const handleSignUp = () => {
        console.log("Sign up clicked");
    };

    const mainContent = (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold mb-4">Single Column Layout Demo</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    A clean, responsive layout perfect for marketing pages, documentation sites,
                    and applications that need a simple yet powerful layout solution.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-blue-600 text-xl font-bold">1</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Responsive Design</h3>
                    <p className="text-sm text-muted-foreground">
                        Optimized for all screen sizes with mobile-first approach
                    </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-green-600 text-xl font-bold">2</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Multiple Variants</h3>
                    <p className="text-sm text-muted-foreground">
                        Choose from 8 different theme variants to match your brand
                    </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-purple-600 text-xl font-bold">3</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Smooth Animations</h3>
                    <p className="text-sm text-muted-foreground">
                        Beautiful entrance animations for enhanced user experience
                    </p>
                </Card>
            </div>
        </div>
    );

    const codeString = `import React from 'react';
import { SingleColumnLayout } from './components/single-column-layout';
import { Card } from './components/card';

function App() {
    const handleNavClick = (href: string, label: string) => {
        console.log(\`Navigating to \${label}: \${href}\`);
    };

    const handleSignIn = () => {
        console.log("Sign in clicked");
    };

    const handleSignUp = () => {
        console.log("Sign up clicked");
    };

    const mainContent = (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold mb-4">Single Column Layout Demo</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    A clean, responsive layout perfect for marketing pages, documentation sites,
                    and applications that need a simple yet powerful layout solution.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-blue-600 text-xl font-bold">1</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Responsive Design</h3>
                    <p className="text-sm text-muted-foreground">
                        Optimized for all screen sizes with mobile-first approach
                    </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-green-600 text-xl font-bold">2</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Multiple Variants</h3>
                    <p className="text-sm text-muted-foreground">
                        Choose from 8 different theme variants to match your brand
                    </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-purple-600 text-xl font-bold">3</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Smooth Animations</h3>
                    <p className="text-sm text-muted-foreground">
                        Beautiful entrance animations for enhanced user experience
                    </p>
                </Card>
            </div>
        </div>
    );

    return (
        <SingleColumnLayout
            variant="default"
            animation="fade"
            stickyHeader={true}
            stickyFooter={false}
            onNavLinkClick={handleNavClick}
            onSignInClick={handleSignIn}
            onSignUpClick={handleSignUp}
            children={mainContent}
            activeNavLink="#"
        />
    );
}

export default App;`;

    return (
        <div className="space-y-6 mb-8">
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-4 border rounded-lg">
                        <div className="h-[600px] overflow-y-auto rounded-lg overflow-hidden shadow-lg">
                            <SingleColumnLayout
                                variant="default"
                                animation="fade"
                                stickyHeader={true}
                                stickyFooter={false}
                                onNavLinkClick={handleNavClick}
                                onSignInClick={handleSignIn}
                                onSignUpClick={handleSignUp}
                                children={mainContent}
                                activeNavLink="#"
                            />
                        </div>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <div className="p-4 border rounded-lg">
                        <CodeBlock language="tsx" className="text-sm">
                            {codeString}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};

export default SingleColumnLayoutDemo;