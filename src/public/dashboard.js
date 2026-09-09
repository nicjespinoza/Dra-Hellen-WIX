import { getTotal1, getSexo} from 'backend/pacientes';
 
    
    
    
    export class pacientes1{
    
    
    
        constructor(){
     
        }
      
      static async create() {
        const instance = new pacientes1();
    
        // Inicialización de las propiedades en el orden correcto
        await instance.init();
    
        return instance;
      }
    
      async init() {
        try {
          this.tipocantidadpaciente = await getTotal1('User');
          
          this.tipocantidadregistro= await getTotal1('User');
          this.tiposexo= await getSexo('User');
          
         // this.tipodesuma = await getTotal2();
        } catch (error) {
          console.error('Error en la inicialización de propiedades:', error);
          console.log('Datos mensuales:', this.tipocantidadpaciente);

        }
      }

    

    async gettipopaciente() {
             
        let stringData = ''
    
       if (Array.isArray(this.tipocantidadpaciente)) {
            // Utiliza el método map solo si this.tipocantidadpaciente es un array
            this.tipocantidadpaciente.map((item, i) => {
                if (i !== this.tipocantidadpaciente.length - 1) {
                    stringData += `${item.status} = ${item.count} | `;
                } else {
                    stringData += `${item.status} = ${item.count}`;
                }
            });
        } else {
            // Maneja el caso en el que this.tipocantidadpaciente no es un array
            console.error("this.tipocantidadpaciente no está definido o no es un array");
        }
    
        return await stringData
    
    }

    async getregistrografico(){
    
        let series = []
        let labels = []
        this.tipocantidadregistro.map((item) => {
    
            series.push (item.count)
            labels.push (item.status)
    })
    
    
    return await [series, labels]
    
     } 



     async getsexo() {
             
        let stringData = ''
    
       if (Array.isArray(this.tiposexo)) {
            // Utiliza el método map solo si this.tipocantidadpaciente es un array
            this.tiposexo.map((item, i) => {
                if (i !== this.tiposexo.length - 1) {
                    stringData += `${item.gender} = ${item.count} | `;
                } else {
                    stringData += `${item.gender} = ${item.count}`;
                }
            });
        } else {
            // Maneja el caso en el que this.tipocantidadpaciente no es un array
            console.error("this.tipocantidadpaciente no está definido o no es un array");
        }
    
        return await stringData
    
    }

    }