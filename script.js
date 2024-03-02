body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

.triangle-container {
  perspective: 800px;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 87px solid #3498db;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}
