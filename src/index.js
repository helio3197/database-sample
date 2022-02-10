import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, onValue, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXu6D_HSqEBKqZkZBHcV4OCOOamlzDuwU",
  authDomain: "test-project-a1d98.firebaseapp.com",
  projectId: "test-project-a1d98",
  databaseURL: "https://test-project-a1d98-default-rtdb.firebaseio.com/",
  storageBucket: "test-project-a1d98.appspot.com",
  messagingSenderId: "129525722100",
  appId: "1:129525722100:web:9f44d59b0316a68c88a7a1",
  measurementId: "G-1G1P24TX20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  if(user !== null) {
    console.log('logged in');
  } else {
    console.log('No user');
  }
});

const database = getDatabase(app);
console.log(database);

// Create Table funciton
function displayData(data) {
  const table = document.getElementById('table-data');
  const tableHeaderHtml = `
    <div class="table-header">Cod.</div>
    <div class="table-header">Producto</div>
    <div class="table-header">Marca</div>
    <div class="table-header">Modelo</div>
    <div class="table-header">Precio</div>
  `;
  let htmlNodes = [tableHeaderHtml];

  data.forEach((item) => {
    const htmlTemp = `
      <div class="table-items">${item.id}</div>
      <div class="table-items">${item.name}</div>
      <div class="table-items">${item.brand}</div>
      <div class="table-items">${item.model}</div>
      <div class="table-items">${item.price}</div>
    `;
    htmlNodes.push(htmlTemp);
  });

  table.innerHTML = htmlNodes.join('');
}

// Get database node
const item = ref(database, 'inventory');
onValue(item, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
  displayData(data);
});

// Upload inventory to database
window.onload = () => {
  const form = document.getElementById('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if(!confirm('Seguro? Esta operación sobrescribirá la data original.')) {
      console.log('Submision aborted!');
      return false;
    }

    const file = document.getElementById('file').files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      const inventory = JSON.parse(fileContent).inventory;
      //console.log(`The content of ${file.name} is ${fileContent}`);
      //console.log(inventory);
      set(item, inventory);
      alert('Base de datos actualizada!');
    };

    reader.onerror = (e) => {
      const error = e.target.error;
      console.error(`Error occured while reading ${file.name}`, error);
      alert('Un error ha occurrido, para mayor información revisar la consola');
    }

    reader.readAsText(file);

    form.elements.file.value = '';
  });
}
