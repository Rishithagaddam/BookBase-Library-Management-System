require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Faculty = require('./models/faculty');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookbase')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    importFaculty();
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Static faculty data
const facultyData = [
    // Admin account
    {
        facultyId: "00ADMIN001",
        facultyname: "Admin",
        email: "23071A059@vnrvjiet.in",
        mobile: "9999999999",
        role: "admin",
        password: "admin123"
    },
    // Faculty from provided data
    {
        facultyId: "00CSE003",
        facultyname: "Dr.V. Baby",
        email: "baby_v@vnrvjiet.in", 
        mobile: "9160000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "97CSE009",
        facultyname: "Dr. C. Kiran Mai",
        email: "ckiranmai@vnrvjiet.in",
        mobile: "9849000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "07CSE021",
        facultyname: "Dr.G. Ramesh Chandra",
        email: "rameshchandra_g@vnrvjiet.in",
        mobile: "9885000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "16CSE105",
        facultyname: "Dr.P.Neelakantan",
        email: "neelakantan_p@vnrvjiet.in",
        mobile: "9886000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "97CSE004",
        facultyname: "Dr.B.V. Kiranmayee",
        email: "kiranmayee_bv@vnrvjiet.in",
        mobile: "7382000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "98CSE011",
        facultyname: "Dr. S. Nagini",
        email: "nagini_s@vnrvjiet.in",
        mobile: "9706000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "23CSE067",
        facultyname: "Dr.M.Madhubala",
        email: "madhubala_m@vnrvjiet.in",
        mobile: "9886000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "00CSE007",
        facultyname: "Dr.M. Gangappa",
        email: "gangappa_m@vnrvjiet.in",
        mobile: "9619000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "09CSE010",
        facultyname: "Dr. P. V. Siva Kumar",
        email: "sivakumar_pv@vnrvjiet.in",
        mobile: "9990000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "10CSE023",
        facultyname: "Dr.A.B.N. Reddy",
        email: "brahmanandareddy_a@vnrvjiet.in",
        mobile: "9010000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "17CSE033",
        facultyname: "Dr.Deepak Sukheja",
        email: "deepak_s@vnrvjiet.in",
        mobile: "9589000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "25CSE031",
        facultyname: "Dr Thayyaba Khatoon MD",
        email: "thayyabakhatoon_md@vnrvjiet.in",
        mobile: "9542000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "22CSE153",
        facultyname: "Dr.Anjusha P",
        email: "anjusha_p@vnrvjiet.in",
        mobile: "8606000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "15CSE020",
        facultyname: "Dr.M.Ravi Kanth",
        email: "ravikanth_m@vnrvjiet.in",
        mobile: "9967000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "07CSE018",
        facultyname: "Dr.N.V.Sailaja",
        email: "sailaja_nv@vnrvjiet.in",
        mobile: "9866000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "07CSE028",
        facultyname: "Dr.D.M. Vasundhara",
        email: "vasundhara_d@vnrvjiet.in",
        mobile: "9490000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "07CSE061",
        facultyname: "Dr. R. Vasavi",
        email: "vasavi_r@vnrvjiet.in",
        mobile: "9948000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "07CSE063",
        facultyname: "Dr.R.Vijaya Saraswathi",
        email: "vijayasaraswathi_r@vnrvjiet.in",
        mobile: "9492000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "16CSE121",
        facultyname: "Dr.K.Srinivas",
        email: "srinivas_k@vnrvjiet.in",
        mobile: "9966000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "07CSE011",
        facultyname: "Dr A. Madhavi",
        email: "madhavi_a@vnrvjiet.in",
        mobile: "9885000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "08CSE066",
        facultyname: "Dr P.Radhika",
        email: "radhika_p@vnrvjiet.in",
        mobile: "8978000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "10CSE016",
        facultyname: "T. Gnana Prakash",
        email: "gnanaprakash_t@vnrvjiet.in",
        mobile: "9985000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "15CSE022",
        facultyname: "S.Jahnavi",
        email: "jahnavi_s@vnrvjiet.in",
        mobile: "9000000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "15CSE094",
        facultyname: "Dr.P.Bharath Kumar",
        email: "bharathkumar_p@vnrvjiet.in",
        mobile: "9505758154",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "16CSE012",
        facultyname: "P.Rama Krishna",
        email: "ramakrishna_p@vnrvjiet.in",
        mobile: "9966446863",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "16CSE089",
        facultyname: "Dr.K.Bheemalingappa",
        email: "bheemalingappa_k@vnrvjiet.in",
        mobile: "9949412264",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "16CSE102",
        facultyname: "Dr L.Indira",
        email: "indira_l@vnrvjiet.in",
        mobile: "9295352540",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "17CSE012",
        facultyname: "Dr.CH.Suresh",
        email: "suresh_ch@vnrvjiet.in",
        mobile: "9866441244",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "17CSE017",
        facultyname: "Dr Kriti Ohri",
        email: "kriti_o@vnrvjiet.in",
        mobile: "9000018233",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "17CSE025",
        facultyname: "Dr.K.Venkata Ramana",
        email: "venkataramana_k@vnrvjiet.in",
        mobile: "9440356874",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "07CSE054",
        facultyname: "K.Jhansi Lakshmi Bai",
        email: "jhansi_cse@vnrvjiet.in",
        mobile: "9966697606",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "12CSE053",
        facultyname: "M.V. Krishna Rao",
        email: "venkatakrishnarao_cse@vnrvjiet.in",
        mobile: "9866693404",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "19CSE009",
        facultyname: "Nyemeesha S",
        email: "nyemeesha_s@vnrvjiet.in",
        mobile: "9951598958",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "19CSE054",
        facultyname: "P.Jyothi",
        email: "jyothi_p@vnrvjiet.in",
        mobile: "7013704625",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "20CSE015",
        facultyname: "K.Bhagya Rekha",
        email: "bhagyarekha_k@vnrvjiet.in",
        mobile: "9949718949",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "20CSE026",
        facultyname: "P.Prasanna",
        email: "prasanna_p@vnrvjiet.in",
        mobile: "8341073043",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "20CSE033",
        facultyname: "G.Laxmi Deepthi",
        email: "laxmideepthi_g@vnrvjiet.in",
        mobile: "9032577918",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "20CSE032",
        facultyname: "K.Haripriya",
        email: "haripriya_k@vnrvjiet.in",
        mobile: "9985807366",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "21CSE031",
        facultyname: "Sudeshna.S",
        email: "sudeshna_s@vnrvjiet.in",
        mobile: "9849965320",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "21CSE035",
        facultyname: "Sudheer Benarji.P",
        email: "sudheerbenarji_p@vnrvjiet.in",
        mobile: "9866062644",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "22CSE029",
        facultyname: "I.Ravindra Kumar",
        email: "ravindrakumar_i@vnrvjiet.in",
        mobile: "9010090209",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "23CSE010",
        facultyname: "P.Praveen",
        email: "praveen_p@vnrvjiet.in",
        mobile: "9032627173",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "22CSE143",
        facultyname: "M.Srikanth",
        email: "srikanth_m@vnrvjiet.in",
        mobile: "9849439438",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "22CSE163",
        facultyname: "K.Akhil",
        email: "akhil_k@vnrvjiet.in",
        mobile: "9701876271",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "23CSE016",
        facultyname: "Ch.Sandhya Rani",
        email: "sandhyarani_ch@vnrvjiet.in",
        mobile: "9849743538",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "23CSE027",
        facultyname: "V.Vijaya Bhaskar",
        email: "vijayabhaskarareddy_v@vnrvjiet.in",
        mobile: "8897192696",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "23CSE038",
        facultyname: "Ch.Suresh Kumar Raju",
        email: "sureshkumarraju_ch@vnrvjiet.in",
        mobile: "8121285286",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "23CSE044",
        facultyname: "P.Rajesh",
        email: "rajesh_p@vnrvjiet.in",
        mobile: "9296406951",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "23CSE064",
        facultyname: "S.K.Saddam Hussain",
        email: "saddam_sk@vnrvjiet.in",
        mobile: "9398236139",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "23CSE070",
        facultyname: "K.Sri Rama Murthy",
        email: "sriramamurthy_k@vnrvjiet.in",
        mobile: "9848093935",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "23CSE074",
        facultyname: "T.Thirupathi Nanuvala",
        email: "thirupathi_t@vnrvjiet.in",
        mobile: "7989150409",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "24CSE056",
        facultyname: "K Swathi",
        email: "swathi_k@vnrvjiet.in",
        mobile: "9849012258",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "24CSE062",
        facultyname: "N Praveen Kumar",
        email: "praveenkumar_n@vnrvjiet.in",
        mobile: "9052175886",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "24CSE113",
        facultyname: "A Sandhya Rani",
        email: "sandhyarani_a@vnrvjiet.in",
        mobile: "9346299918",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "24CSE121",
        facultyname: "S Ambika",
        email: "ambika_s@vnrvjiet.in",
        mobile: "7396121488",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "25CSE010",
        facultyname: "Somaradha Satyadev Bulusu",
        email: "somaradhasatyadev_b@vnrvjiet.in",
        mobile: "9908279034",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "25CSE012",
        facultyname: "Srijitha Majumder",
        email: "srijita_m@vnrvjiet.in",
        mobile: "6290839897",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "25CSE028",
        facultyname: "Sana Inayath",
        email: "sana_i@vnrvjiet.in",
        mobile: "9346169025",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "25CSE036",
        facultyname: "K Pratap Joshi",
        email: "pratapjoshi_k@vnrvjiet.in",
        mobile: "7674876987",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "25CSE037",
        facultyname: "M Sandeep",
        email: "sandeep_m@vnrvjiet.in",
        mobile: "7842686700",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "25CSE058",
        facultyname: "A Katyayani",
        email: "katyayani_a@vnrvjiet.in",
        mobile: "9963949218",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "25CSE072",
        facultyname: "S Sravanthi",
        email: "sravanthi_s@vnrvjiet.in",
        mobile: "9948323694",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "08CSE026",
        facultyname: "M.Ram Babu",
        email: "rambabu_cse@vnrvjiet.in",
        mobile: "9849674960",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "05ADM002",
        facultyname: "V.Dhanashmi",
        email: "dhanashmi_cse@vnrvjiet.in",
        mobile: "8885497583",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "09CSE037",
        facultyname: "V.Vijaya Lakshmi",
        email: "vijayalakshmi_cse@vnrvjiet.in",
        mobile: "7702884597",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "01EEE005",
        facultyname: "B. Usha Rani",
        email: "usharani_cse@vnrvjiet.in",
        mobile: "9014705689",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "19CSE021",
        facultyname: "B.Suneetha",
        email: "bsuneetha_cse@vnrvjiet.in",
        mobile: "7829973172",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "19CSE041",
        facultyname: "P.Ramesh",
        email: "pramesh_cse@vnrvjiet.in",
        mobile: "9908569718",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "22CSE020",
        facultyname: "P.Lalitha Kumari",
        email: "plalithakumari_cse@vnrvjiet.in",
        mobile: "9177508696",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "23CSE122",
        facultyname: "B Pavan Kumar",
        email: "pavankumar_cse@vnrvjiet.in",
        mobile: "9908203102",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "24CSE038",
        facultyname: "A.Amara Vani",
        email: "amaravani_cse@vnrvjiet.in",
        mobile: "9878553349",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "22CSE015",
        facultyname: "P.Praveen",
        email: "ppraveen_cse@vnrvjiet.in",
        mobile: "9700019747",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "23CSE054",
        facultyname: "Ch.Jyothi",
        email: "jyothi_cse@vnrvjiet.in",
        mobile: "9866918571",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "03CSE003",
        facultyname: "K.Sreedhar",
        email: "sreedhar_k@vnrvjiet.in",
        mobile: "9849862780",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "15CSE031",
        facultyname: "N.Lakshmi Kalyani",
        email: "lakshmikalyani_n@vnrvjiet.in",
        mobile: "9966000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "15CSE032",
        facultyname: "N.Sandeep Chaitanya",
        email: "sandeepchaitanya_n@vnrvjiet.in",
        mobile: "9885000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "15CSE048",
        facultyname: "N.Sarika",
        email: "sarika_n@vnrvjiet.in",
        mobile: "9909000000",
        role: "faculty",
        password: "vnrvjiet@123"
    },
    {
        facultyId: "15CSE091",
        facultyname: "Dr.Tejaswi.P",
        email: "tejaswi_p@vnrvjiet.in",
        mobile: "9492000000",
        role: "faculty",
        password: "vnrvjiet@123"
    }
];

// Function to import faculty data
const importFaculty = async () => {
    try {
        // Clear existing data
        await Faculty.deleteMany({});
        console.log('✅ Existing faculty data cleared');

        // Hash passwords before inserting
        const saltRounds = 10;
        const promises = facultyData.map(async (faculty) => {
            const hashedPassword = await bcrypt.hash(faculty.password, saltRounds);
            return {
                ...faculty,
                password: hashedPassword,
                currentlyIssuedBooks: [],
                totalBooksIssued: 0
            };
        });
        
        const facultyWithHashedPasswords = await Promise.all(promises);
        
        // Insert all faculty data
        await Faculty.insertMany(facultyWithHashedPasswords);
        console.log(`✅ ${facultyData.length} faculty members imported successfully`);
        console.log('✅ All passwords hashed and set to vnrvjiet@123 for faculty members');
        
        mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error importing faculty:', error);
        mongoose.connection.close();
    }
};

// Execute the import if this file is run directly
if (require.main === module) {
    // importFaculty will be called after successful MongoDB connection
}