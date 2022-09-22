import Image from "next/image";

const Footer = () => {
  return (
    <div className="bg-zakvan_red-dark py-10 px-14 text-white text-xs md:text-base text-center sm:text-left">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 items-center space-y-4">
          <div>
            <h4 className="font-bold text-base sm:text-xl">Get to Know Us</h4>
            <p className="link">About</p>
            <p className="link">Connect with Us</p>
            <p className="link">Cares</p>
            <p className="link">Gift a Smile</p>
          </div>
          <div>
            <h4 className="font-bold text-base sm:text-xl">Payment</h4>
            <p className="link">Business Card</p>
            <p className="link">Shop with Points</p>
            <p className="link">Reload Your Balance</p>
            <p className="link">Currency Converter</p>
          </div>
          <div>
            <h4 className="font-bold text-base sm:text-xl">Let Us Help You</h4>
            <p className="link">COVID-19</p>
            <p className="link">Shipping Rates & Policies</p>
            <p className="link">Returns & Replacements</p>
            <p className="link">Manage Your Devices</p>
            <p className="link">Assistant</p>
          </div>
        </div>
        <div className="border-t border-gray-300 sm:flex items-center pt-5 mt-5">
          <div className="mx-auto mb-2 sm:m-0">
            <Image
              src="/Zakvan.svg"
              width={90}
              height={45}
              objectFit="contain"
            />
          </div>

          <p className="text-sm sm:text-xl sm:pl-3">
            © 2021 | Developed by{" "}
            <span className="font-bold link ">Tanjil Rahman</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
