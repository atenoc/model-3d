import { AfterViewInit, Component, HostListener } from '@angular/core';
import { fabric } from 'fabric';
import { SharedServiceService } from '../services/shared-service.service';

@Component({
  selector: 'app-adontograma2',
  templateUrl: './adontograma2.component.html',
  styleUrls: ['./adontograma2.component.css']
})
export class Adontograma2Component implements AfterViewInit{

  canvas!: fabric.Canvas;
  brushSize: number = 5; // Valor inicial para el grosor del pincel
  brushColor: string = '#000000'; // Color inicial para el pincel, negro por defecto
  quickColors = [
    '#FF0000', // Rojo
    '#FF69B4', // Rosa
    '#800080', // Morado
    '#0D6EFD', // Azul
    '#28a745', // Verde
    '#FFFF00', // Amarillo
    '#FFA500', // Naranja
    '#6c757d', // Gris
    '#000000' // Negro
  ];
  
  texto!: fabric.Text; // Suponiendo que ya tienes una variable de clase para el texto

  constructor(private sharedService: SharedServiceService) { }

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas('canvas', {
      width: 1300,
      height: 800
    });

    // Inicializar tu canvas aquí
    this.dibujarCapas();
    this.dibujar(); // Inicia con el modo de dibujo activado

    // Suscribirse para recibir la imagen capturada
    this.sharedService.getImage().subscribe(imageData => {
      if (imageData) {
        // Eliminar la imagen previa
        this.removePreviousImage();

        // Agregar la nueva imagen
        fabric.Image.fromURL(imageData, (imagen) => {
          imagen.data = { isBackground: true };
          imagen.selectable = false;
          imagen.evented = false;
          this.canvas.add(imagen);
          this.canvas.sendToBack(imagen);
        });
      }
    });

    this.agregarTexto();
    // Suscribirse al evento 'object:added' para asegurar que el texto siempre esté en la capa superior
    this.canvas.on('object:added', () => {
      // Mover el texto a la parte superior cada vez que se añada un nuevo objeto
      this.texto.bringToFront();
    });
  }

  private removePreviousImage(): void {
    // Buscar y eliminar la imagen de fondo previa
    const objects = this.canvas.getObjects('image');
    const backgroundImage = objects.find(obj => obj.data?.isBackground);

    if (backgroundImage) {
      this.canvas.remove(backgroundImage);
    }
  }

  dibujarCapas() {
    fabric.Image.fromURL('assets/odontograma.jpg', (imagen) => {
      imagen.data = { isBackground: true };
      imagen.selectable = false;
      imagen.evented = false;
  
      // Calcular la posición para centrar la imagen en el canvas
      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();
  
      // Redimensionar la imagen si es necesario (opcional)
      const scaleFactor = Math.min(canvasWidth / imagen.width!, canvasHeight / imagen.height!);
  
      // Centrar la imagen en el canvas
      imagen.set({
        left: (canvasWidth - imagen.width! * scaleFactor) / 2,
        top: (canvasHeight - imagen.height! * scaleFactor) / 2,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
      });
  
      this.canvas.add(imagen);
      this.canvas.sendToBack(imagen);
      this.canvas.renderAll();
    });
  }

  seleccionar() {
    this.canvas.isDrawingMode = false; // Desactivar el modo de dibujo
    this.canvas.off('mouse:down'); // Asegurarse de desactivar el borrador u otros manejadores de eventos de mouse asociados
  
    // Restaurar la interactividad de los objetos que no son el fondo
    this.restaurarInteractividad();

    // Establecer el cursor a 'pointer' para cuando el ratón esté sobre un objeto del canvas
    this.canvas.defaultCursor = 'pointer';

  }
  
  
  dibujar() {
    // Desactivar manejador de eventos de borrado
    this.canvas.off('mouse:down');
    this.canvas.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });
    this.canvas.isDrawingMode = true;
    // Asegurar que el grosor del pincel se actualice al valor actual de brushSize
    this.cambiarGrosorPincel();
    // Asegurar que el color del pincel se actualice al valor actual de brushColor
    this.cambiarColorPincel(this.brushColor);
  }

  cambiarGrosorPincel() {
    if (this.canvas.isDrawingMode) {
      this.canvas.freeDrawingBrush.width = this.brushSize;
    }
  }

  cambiarColorPincel(color: string = this.brushColor) {
    console.log("Se cambio color paleta")
    this.brushColor = color;
    if (this.canvas.isDrawingMode) {
      this.canvas.freeDrawingBrush.color = this.brushColor;
    }
  }

  borrador() {
    this.canvas.isDrawingMode = false; // Desactivar el modo de dibujo
    // Deseleccionar cualquier objeto activo en el canvas
    this.canvas.discardActiveObject();
    // Renderizar el canvas para reflejar la deselección
    this.canvas.renderAll();

    // Remover previamente cualquier manejador de eventos de borrado para evitar duplicados
    this.canvas.off('mouse:down');
    this.canvas.on('mouse:down', (options) => {
      const objeto = options.target;
      if (objeto && !objeto.data?.isBackground) {
        this.canvas.remove(objeto);
      }
    });

    // Restaurar la interactividad de los objetos que no son el fondo
    this.restaurarInteractividad();

    this.canvas.defaultCursor = 'no-drop';

  }

  resetCanvas() {
    const objetos = this.canvas.getObjects();
    for (let i = objetos.length - 1; i >= 0; i--) {
      // Verificar si el objeto actual no es la capa de fondo ni el texto inicial
      if (!objetos[i].data?.isBackground && !objetos[i].data?.isTextoInicial) {
        this.canvas.remove(objetos[i]);
      }
    }
    this.canvas.renderAll(); // Renderizar el estado actual del canvas
  }
  
  dibujarLinea() {
    let linea: fabric.Line | null = null;
    let isDown: boolean = false;
  
    this.canvas.isDrawingMode = false;
    
    // Desactivar la selección global en el canvas
    this.canvas.selection = false;
  
    this.canvas.forEachObject((obj) => {
      // Desactivar la selección y eventos para todos los objetos
      obj.selectable = false;
      obj.evented = false;
    });
  
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.canvas.off('mouse:up');
  
    this.canvas.on('mouse:down', (o) => {
      isDown = true;
      const pointer = this.canvas.getPointer(o.e);
      const points = [pointer.x, pointer.y, pointer.x, pointer.y];
      linea = new fabric.Line(points, {
        strokeWidth: this.brushSize,
        fill: this.brushColor,
        stroke: this.brushColor,
        originX: 'center',
        originY: 'center',
        selectable: false, // La línea no será seleccionable mientras se crea
        evented: false, // La línea no responderá a eventos mientras se crea
      });
      this.canvas.add(linea);
    });
  
    this.canvas.on('mouse:move', (o) => {
      if (!isDown) return;
      const pointer = this.canvas.getPointer(o.e);
      if (linea) {
        linea.set({ x2: pointer.x, y2: pointer.y });
        this.canvas.renderAll();
      }
    });
  
    this.canvas.on('mouse:up', () => {
      isDown = false;
      // Reactivar la selección global en el canvas
      this.canvas.selection = true;
  
      // No es necesario restablecer selectable y evented para todos los objetos aquí
      // Si necesitas que la línea sea interactuable después de dibujarla, ajusta sus propiedades ahora
      if (linea) {
        linea.set({ selectable: true, evented: true });
      }
    });

    this.canvas.defaultCursor = 'copy';
  }
  
  guardarComoPNG() {
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1.0 // Calidad de la imagen, donde 1.0 es la máxima calidad
    });
    
    // Crear un elemento <a> para iniciar la descarga
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'miCanvas.png'; // Nombre del archivo para descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Limpiar añadiendo y removiendo el enlace del documento
  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Delete') {
      const activeObject = this.canvas.getActiveObject();
      const activeGroup = this.canvas.getActiveObjects(); // Para seleccionar múltiples objetos

      // Si hay un grupo de objetos seleccionados, eliminarlos todos
      if (activeGroup.length > 0) {
        activeGroup.forEach((object) => {
          this.canvas.remove(object);
        });
        this.canvas.discardActiveObject(); // Deseleccionar el grupo después de eliminar
      } else if (activeObject) {
        // Si solo hay un objeto seleccionado, eliminarlo
        this.canvas.remove(activeObject);
      }

      this.canvas.requestRenderAll(); // Solicitar la renderización del canvas para reflejar los cambios
    }
  }
  
  restaurarInteractividad() {
    this.canvas.forEachObject((obj) => {
      if (!obj.data?.isBackground) { // Ignorar el fondo
        obj.selectable = true;
        obj.evented = true;
      }
    });
    this.canvas.renderAll(); // Renderizar el canvas para reflejar los cambios
  }

  agregarTexto() {
    this.texto = new fabric.Text('Paciente: Fulanito Tal... - Fecha: 09/03/2024', {
      left: 650, // Posición horizontal desde el borde izquierdo del canvas
      top: 34, // Posición vertical desde el borde superior del canvas
      fontFamily: 'Arial',
      fontSize: 15,
      fill: '#fff', // Color del texto
      backgroundColor: 'red',
      data: { isTextoInicial: true } // Asignar una propiedad personalizada
    });
    this.canvas.add(this.texto);
  }

  // Método para mostrar el input file
  uploadImage(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  // Manejar la carga del archivo seleccionado
  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageData = e.target.result as string;
        this.removePreviousImage();
        this.addImageToCanvas(imageData);
      };
      reader.readAsDataURL(file);
    }
  }

  private addImageToCanvas(imageData: string): void {
    fabric.Image.fromURL(imageData, (imagen) => {
      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();
      const scaleFactor = Math.min(canvasWidth / imagen.width!, canvasHeight / imagen.height!);

      imagen.set({
        left: (canvasWidth - imagen.width! * scaleFactor) / 2,
        top: (canvasHeight - imagen.height! * scaleFactor) / 2,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
      });

      this.canvas.add(imagen);
      this.canvas.sendToBack(imagen);
      this.canvas.renderAll();
    });
  }

}