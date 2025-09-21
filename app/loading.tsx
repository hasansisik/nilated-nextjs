
export default function Preloader() {
	return (
		<>
			<div id="preloader">
				<div id="loader" className="loader">
					<div className="loader-container text-center">
						<div className="loader-icon">
							<img 
								src="/assets/imgs/template/icons.png" 
								alt="Preloader" 
								style={{ 
									width: '40px', 
									height: '40px',
									objectFit: 'contain'
								}} 
							/>
							<p style={{ marginTop: '10px', color: '#333' }}>Yükleniyor...</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
