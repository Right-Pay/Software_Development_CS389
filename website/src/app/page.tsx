import React from 'react';
import Image from 'next/image';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen min-w-screen ml-auto mr-auto flex flex-col bg-gray-100">
      {/* Header */}
      <header className="mb-8 bg-dark-green flex items-center lg:justify-center">
        <h1 className="text-4xl font-bold m-4 text-white">RightPayNow</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center">
        <div className="mx-auto w-full px-5 lg:px-0 lg:w-1/2">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-dark-green">Test Flight Build</h2>
            <p className="text-gray-600 mb-6">
              Try out our latest features by downloading the Test Flight build.
            </p>

            <div className="flex flex-col lg:flex-row items-center space-4">
              <a
                href="https://testflight.apple.com/join/bNULzSj3"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                Download Now
              </a>

              {/* You may replace the QR code with your own implementation */}
              <div className="flex-shrink-0">
                <Image src={'../assets/svg/TestFlightQRCode.svg'} alt="RightPayNow TestFlight QR Code" width={200} height={200} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex mt-auto mx-auto pb-5 lg:pb-10 px-5 pt-4 lg:px-0 w-full lg:w-1/2 border-t-2 border-gray-300 text-gray-500 text-sm">
        <p>&copy; 2023 RightPayNow. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home;