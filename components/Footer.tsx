export default function Footer() {
  return (
    <footer className="bg-black bg-opacity-80 text-white py-4 border-t border-neon-blue">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <p className="text-neon-blue">&copy; 2023 Çiftçilik Sistemi</p>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-neon-pink hover:text-neon-blue transition-colors">
                Hakkımızda
              </a>
            </li>
            <li>
              <a href="#" className="text-neon-pink hover:text-neon-blue transition-colors">
                İletişim
              </a>
            </li>
            <li>
              <a href="#" className="text-neon-pink hover:text-neon-blue transition-colors">
                Gizlilik Politikası
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}

