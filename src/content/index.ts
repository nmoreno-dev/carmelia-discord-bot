import * as fs from 'fs';
import * as path from 'path';

// Función para leer el archivo y guardar su contenido en un objeto
function readFile(fileName: string) {
  try {
    // Obtenemos la ruta absoluta del archivo
    const absolutePath = path.resolve(
      path.join(__dirname, '/knowledge', `/${fileName}.txt`),
    );

    // Leemos el contenido del archivo
    const fileContent = fs.readFileSync(absolutePath, 'utf8');

    return JSON.stringify({ fileContent: fileContent });
  } catch (error) {
    console.error('Error leyendo el archivo:', error);
    throw error;
  }
}

// const fileName = 'general_knowledge';
// const fileData = readFileToObject(fileName);
// console.log(fileData);

export default readFile;
