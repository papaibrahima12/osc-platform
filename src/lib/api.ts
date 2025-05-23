import { supabase } from './supabase';
import type { NGO, Profile, Activity } from '../types/user';
import toast from 'react-hot-toast';

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    if (!data.user) throw new Error('Identifiants invalides');
    
    return { user: data.user };
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error( error instanceof Error ? error.message : 'Erreur lors de la connexion');
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function resetPassword(email: string) {
  try {
    console.log('email', email);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (profileError) throw profileError;
    
    if (!profile) {
      throw new Error('Aucun compte n\'existe avec cet email');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Reset password error:', error);
    throw new Error(error instanceof Error ? error.message : 'Erreur lors de la réinitialisation du mot de passe');
  }
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
}

// Profile functions
export async function getProfile(id: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Profil non trouvé');
    
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error(error instanceof Error ? error.message : 'Erreur lors de la récupération du profil');
  }
}

export async function updateProfile(id: string, data: Partial<Profile>) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return profile;
}

export async function listUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function listManagers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role','ngo_manager')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function createUser(email: string, userData: Partial<Profile>) {
  try {
    if (!email || !userData.first_name || !userData.last_name || !userData.role) {
      throw new Error('Tous les champs sont requis');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Format d\'email invalide');
    }

    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

      if (existingUser) {
      throw new Error('Cette adresse email existe déjà');
    }

    const { data: response, error } = await supabase.functions.invoke('create-user', {
      body: { email, userData }
    });


    if (error) {
      if (error.message.includes('already exists')) {
        throw new Error('Cette adresse email existe déjà');
      }
      throw error;
    }

    if (!response?.profile) {
      throw new Error('Erreur lors de la création du profil');
    }

    return response.profile;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(error instanceof Error ? error.message : 'Une erreur est survenue lors de la création de l\'utilisateur');
  }
}

// NGO functions
export async function listNGOs() {
  const { data: ngos, error: ngosError } = await supabase
    .from('ngos')
    .select('*')
    .order('created_at', { ascending: false });

  if (ngosError) throw ngosError;

  const enrichedNGOs = await Promise.all(ngos.map(async (ngo) => {
    const [
      { data: staffData },
      { data: sectors },
      { data: zones },
      { data: investments },
      { data: resources },
      { data: beneficiaries },
      { data: realizations }
    ] = await Promise.all([
      supabase.from('ngo_staff').select('*').eq('ngo_id', ngo.id),
      supabase.from('ngo_activity_sectors').select('*').eq('ngo_id', ngo.id),
      supabase.from('ngo_intervention_zones').select('*').eq('ngo_id', ngo.id),
      supabase.from('ngo_investments').select('*').eq('ngo_id', ngo.id),
      supabase.from('ngo_financial_resources').select('*').eq('ngo_id', ngo.id),
      supabase.from('ngo_beneficiaries').select('*').eq('ngo_id', ngo.id),
      supabase.from('ngo_realizations').select('*').eq('ngo_id', ngo.id)
    ]);

    const staff = staffData?.[0] || null;

    return {
      ...ngo,
      staff,
      activity_sectors: sectors || [],
      intervention_zones: zones || [],
      investments: investments || [],
      financial_resources: resources || [],
      beneficiaries: beneficiaries || [],
      realizations: realizations || []
    };
  }));

  return enrichedNGOs;
}

export async function getNGO(ngoId?: string) {
  const { data: ngo, error: ngoError } = await supabase
    .from('ngos')
    .select('*')
    .eq('id', ngoId)
    .single();

  if (ngoError) throw ngoError;

  const [
    { data: staffData },
    { data: sectors },
    { data: zones },
    { data: investments },
    { data: resources },
    { data: beneficiaries },
    { data: realizations }
  ] = await Promise.all([
    supabase.from('ngo_staff').select('*').eq('ngo_id', ngo.id),
    supabase.from('ngo_activity_sectors').select('*').eq('ngo_id', ngo.id),
    supabase.from('ngo_intervention_zones').select('*').eq('ngo_id', ngo.id),
    supabase.from('ngo_investments').select('*').eq('ngo_id', ngo.id),
    supabase.from('ngo_financial_resources').select('*').eq('ngo_id', ngo.id),
    supabase.from('ngo_beneficiaries').select('*').eq('ngo_id', ngo.id),
    supabase.from('ngo_realizations').select('*').eq('ngo_id', ngo.id)
  ]);

  const staff = staffData?.[0] || null;

  return {
    ...ngo,
    staff,
    activity_sectors: sectors || [],
    intervention_zones: zones || [],
    investments: investments || [],
    financial_resources: resources || [],
    beneficiaries: beneficiaries || [],
    realizations: realizations || []
  };
}

export async function getMyNGO(userId?: string) {
    const { data: ngo, error: ngoError } = await supabase
        .from('ngos')
        .select('*')
        .eq('manager_id', userId)
        .single();

    if (ngoError) throw ngoError;

    const [
        { data: staffData },
        { data: sectors },
        { data: zones },
        { data: investments },
        { data: resources },
        { data: beneficiaries },
        { data: realizations }
    ] = await Promise.all([
        supabase.from('ngo_staff').select('*').eq('ngo_id', ngo.id),
        supabase.from('ngo_activity_sectors').select('*').eq('ngo_id', ngo.id),
        supabase.from('ngo_intervention_zones').select('*').eq('ngo_id', ngo.id),
        supabase.from('ngo_investments').select('*').eq('ngo_id', ngo.id),
        supabase.from('ngo_financial_resources').select('*').eq('ngo_id', ngo.id),
        supabase.from('ngo_beneficiaries').select('*').eq('ngo_id', ngo.id),
        supabase.from('ngo_realizations').select('*').eq('ngo_id', ngo.id)
    ]);

    const staff = staffData?.[0] || null;

    return {
        ...ngo,
        staff,
        activity_sectors: sectors || [],
        intervention_zones: zones || [],
        investments: investments || [],
        financial_resources: resources || [],
        beneficiaries: beneficiaries || [],
        realizations: realizations || []
    };
}


export async function createNGO(data: Omit<NGO, 'id' | 'created_at' | 'updated_at'>) {
  const {
    staff,
    activity_sectors,
    intervention_zones,
    investments,
    financial_resources,
    beneficiaries,
    realizations,
    agreementDocument,
    ...ngoData
  } = data;

  try {
    const { data: ngo, error: ngoError } = await supabase
      .from('ngos')
      .insert({
        ...ngoData,
        latitude: ngoData.latitude,
        longitude: ngoData.longitude
      })
      .select()
      .single();

    if (ngoError) throw ngoError;

    let agreementUrl;
    if (agreementDocument && ngo.status === 'ngo') {
      try {
        if (!agreementDocument.type.includes('pdf')) {
          toast.error('Le document doit être au format PDF');
          throw new Error('Le document doit être au format PDF');
        }

        if (agreementDocument.size > 5 * 1024 * 1024) {
          toast.error('Le document ne doit pas dépasser 5MB');
          throw new Error('Le document ne doit pas dépasser 5MB');
        }

        const filePath = `${ngo.id}/agreement.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('agreements')
          .upload(filePath, agreementDocument, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('agreements')
          .getPublicUrl(filePath);

        agreementUrl = data.publicUrl;
      } catch (uploadError) {
        await supabase.from('ngos').delete().eq('id', ngo.id);
        throw uploadError;
      }
    }

    const promises = [];

    if (staff) {
      promises.push(
          supabase
              .from('ngo_staff')
              .insert({ ...staff, ngo_id: ngo.id })
      );
    }

    if (activity_sectors?.length) {
      promises.push(
          supabase
              .from('ngo_activity_sectors')
              .insert(activity_sectors.map(sector => ({
                ngo_id: ngo.id,
                activity_year: sector.activity_year,
                sector: sector.sector,
                subsector: sector.subsector,
                activity_count: sector.activity_count
              })))
      );
    }

    if (intervention_zones?.length) {
      const countryAndRegionZones = intervention_zones.filter(
          zone => zone.zone_type === 'country' || zone.zone_type === 'region'
      );

      if (countryAndRegionZones.length) {
        const { error: zonesError } = await supabase
            .from('ngo_intervention_zones')
            .insert(countryAndRegionZones.map(zone => ({
              ngo_id: ngo.id,
              zone_type: zone.zone_type,
              name: zone.name,
              parent_zone_id: null
            })));

        if (zonesError) throw zonesError;
      }

      const departmentZones = intervention_zones.filter(zone => zone.zone_type === 'department');
      if (departmentZones.length) {
        const { data: insertedRegions } = await supabase
            .from('ngo_intervention_zones')
            .select('id, name')
            .eq('ngo_id', ngo.id)
            .eq('zone_type', 'region');

        const regionMap = (insertedRegions || []).reduce((acc, region) => {
          acc[region.name] = region.id;
          return acc;
        }, {} as Record<string, string>);

        const { error: deptError } = await supabase
            .from('ngo_intervention_zones')
            .insert(departmentZones.map(zone => ({
              ngo_id: ngo.id,
              zone_type: zone.zone_type,
              name: zone.name,
              parent_zone_id: regionMap[zone.parent_zone_id || ''] || null
            })));

        if (deptError) throw deptError;
      }

      const municipalityZones = intervention_zones.filter(zone => zone.zone_type === 'municipality');
      if (municipalityZones.length) {
        const { data: insertedDepts } = await supabase
            .from('ngo_intervention_zones')
            .select('id, name')
            .eq('ngo_id', ngo.id)
            .eq('zone_type', 'department');

        const deptMap = (insertedDepts || []).reduce((acc, dept) => {
          acc[dept.name] = dept.id;
          return acc;
        }, {} as Record<string, string>);

        const { error: muniError } = await supabase
            .from('ngo_intervention_zones')
            .insert(municipalityZones.map(zone => ({
              ngo_id: ngo.id,
              zone_type: zone.zone_type,
              name: zone.name,
              parent_zone_id: deptMap[zone.parent_zone_id || ''] || null
            })));

        if (muniError) throw muniError;
      }
    }

    if (investments?.length) {
      promises.push(
          supabase
              .from('ngo_investments')
              .insert(investments.map(investment => ({
                ngo_id: ngo.id,
                investment_year: investment.investment_year,
                sector: investment.sector,
                subsector: investment.subsector,
                amount: investment.amount
              })))
      );
    }

    if (financial_resources?.length) {
      promises.push(
          supabase
              .from('ngo_financial_resources')
              .insert(financial_resources.map(resource => ({
                ngo_id: ngo.id,
                funding_year: resource.funding_year,
                funding_type: resource.funding_type,
                funding_source: resource.funding_source,
                amount: resource.amount,
                details: resource.details
              })))
      );
    }

    if (beneficiaries?.length) {
      promises.push(
          supabase
              .from('ngo_beneficiaries')
              .insert(beneficiaries.map(beneficiary => ({
                ngo_id: ngo.id,
                sector: beneficiary.sector,
                total: beneficiary.total,
                men: beneficiary.men,
                women: beneficiary.women,
                young: beneficiary.young,
                pregnant_women: beneficiary.pregnant_women,
                lactating_women: beneficiary.lactating_women,
                teachers: beneficiary.teachers,
                students: beneficiary.students,
                legal_entities: beneficiary.legal_entities,
                child_before_preschool_age: beneficiary.child_before_preschool_age,
                preschool_age_child: beneficiary.preschool_age_child,
                school_age_child: beneficiary.school_age_child,
                disabled: beneficiary.disabled,
                other_vulnerable: beneficiary.other_vulnerable
              })))
      );
    }

    if (realizations?.length) {
      promises.push(
          supabase
              .from('ngo_realizations')
              .insert(realizations.map(realization => ({
                ngo_id: ngo.id,
                sector: realization.sector,
                indicator: realization.indicator,
                value: realization.value
              })))
      );
    }

    await Promise.all(promises);

    return { ...ngo, agreementUrl };
  } catch (error) {
    console.error('Error in createNGO:', error);
    throw error;
  }

}

function normalizeStaffObject(staff: any) {
    const {
        id,
        created_at,
        updated_at,
        ...relevantFields
    } = staff; // Exclure les champs supplémentaires
    return relevantFields;
}


export async function updateNGO(id: string, data: Partial<NGO>) {
  const {
    staff,
    activity_sectors,
    intervention_zones,
    investments,
    financial_resources,
    beneficiaries,
    realizations,
    agreementDocument,
    ...ngoData
  } = data;

  try {
    const { data: ngo, error: ngoError } = await supabase
      .from('ngos')
      .update({
        ...ngoData,
      latitude: ngoData.latitude,
      longitude: ngoData.longitude
      })
      .eq('id', id)
      .select()
      .single();

    if (ngoError) throw ngoError;
    console.error('ngoError', ngoError);

    if (agreementDocument && ngo.status === 'ngo') {

        if (!agreementDocument.type.includes('pdf')) {
          throw new Error('Le document doit être au format PDF');
        }

        if (agreementDocument.size > 5 * 1024 * 1024) {
          throw new Error('Le document ne doit pas dépasser 5MB');
        }

        const filePath = `${ngo.id}/agreement.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('agreements')
          .upload(filePath, agreementDocument, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;
    }

      if (staff) {
          const { data: currentStaff } = await supabase
              .from('ngo_staff')
              .select('*')
              .eq('ngo_id', id)
              .single();

          // Normaliser les deux objets pour une comparaison correcte
          const normalizedCurrentStaff = currentStaff ? normalizeStaffObject(currentStaff) : {};
          const normalizedNewStaff = normalizeStaffObject({ ...staff, ngo_id: id });

          console.log('Staff actuel :', normalizedCurrentStaff);
          console.log('Staff nouveau :', normalizedNewStaff);

          // Comparer correctement les objets normalisés
          if (JSON.stringify(normalizedCurrentStaff) !== JSON.stringify(normalizedNewStaff)) {
              console.log('Différence détectée, mise à jour du staff');

              if (!currentStaff) {
                  const { error: insertError } = await supabase
                      .from('ngo_staff')
                      .insert({ ...staff, ngo_id: id });

                  if (insertError) throw insertError;
              } else {
                  // Mise à jour si le staff existe déjà
                  const { error: staffError } = await supabase
                      .from('ngo_staff')
                      .update({ ...staff })
                      .eq('ngo_id', id);

                  if (staffError) throw staffError;
              }
          } else {
              console.log('Aucune différence dans les données du staff, pas de mise à jour nécessaire');
          }
      }

    if (activity_sectors?.length) {
      const { data: currentSectors } = await supabase
          .from('ngo_activity_sectors')
          .select('*')
          .eq('ngo_id', id);

      const currentSectorsString = JSON.stringify(currentSectors?.sort((a, b) =>
          `${a.sector}${a.subsector}`.localeCompare(`${b.sector}${b.subsector}`)
      ));
      const newSectorsString = JSON.stringify(activity_sectors.map(sector => ({
        ...sector,
        ngo_id: id
      })).sort((a, b) =>
          `${a.sector}${a.subsector}`.localeCompare(`${b.sector}${b.subsector}`)
      ));

      if (currentSectorsString !== newSectorsString) {
        const { error: deleteError } = await supabase
            .from('ngo_activity_sectors')
            .delete()
            .eq('ngo_id', id);

        if (deleteError) throw deleteError;

        const { error: insertError } = await supabase
            .from('ngo_activity_sectors')
            .insert(activity_sectors.map(sector => ({
              ngo_id: id,
              activity_year: sector.activity_year,
              sector: sector.sector,
              subsector: sector.subsector,
              activity_count: sector.activity_count
            })));

        if (insertError) throw insertError;
      }
    }

    if (intervention_zones) {
      const { data: currentZones } = await supabase
          .from('ngo_intervention_zones')
          .select('*')
          .eq('ngo_id', id);

      const currentZonesString = JSON.stringify(currentZones?.sort((a, b) =>
          `${a.zone_type}${a.name}`.localeCompare(`${b.zone_type}${b.name}`)
      ));
      const newZonesString = JSON.stringify(intervention_zones.map(zone => ({
        ...zone,
        ngo_id: id
      })).sort((a, b) =>
          `${a.zone_type}${a.name}`.localeCompare(`${b.zone_type}${b.name}`)
      ));

      if (currentZonesString !== newZonesString) {
        await supabase.from('ngo_intervention_zones').delete().eq('ngo_id', id);

        const countryAndRegionZones = intervention_zones.filter(
            zone => zone.zone_type === 'country' || zone.zone_type === 'region'
        );

        if (countryAndRegionZones.length) {
          const { data: insertedBasicZones, error: basicZonesError } = await supabase
              .from('ngo_intervention_zones')
              .insert(countryAndRegionZones.map(zone => ({
                ngo_id: id,
                zone_type: zone.zone_type,
                name: zone.name,
                parent_zone_id: null
              })))
              .select();

          if (basicZonesError) throw basicZonesError;

          const departmentZones = intervention_zones.filter(zone => zone.zone_type === 'department');
          if (departmentZones.length) {
            const regionMap = insertedBasicZones
                .filter(zone => zone.zone_type === 'region')
                .reduce((acc, region) => {
                  acc[region.name] = region.id;
                  return acc;
                }, {} as Record<string, string>);

            const { data: insertedDepts, error: deptsError } = await supabase
                .from('ngo_intervention_zones')
                .insert(departmentZones.map(zone => ({
                  ngo_id: id,
                  zone_type: zone.zone_type,
                  name: zone.name,
                  parent_zone_id: regionMap[zone.parent_zone_id || ''] || null
                })))
                .select();

            if (deptsError) throw deptsError;

            const municipalityZones = intervention_zones.filter(zone => zone.zone_type === 'municipality');
            if (municipalityZones.length) {
              const deptMap = insertedDepts.reduce((acc, dept) => {
                acc[dept.name] = dept.id;
                return acc;
              }, {} as Record<string, string>);

              const { error: muniError } = await supabase
                  .from('ngo_intervention_zones')
                  .insert(municipalityZones.map(zone => ({
                    ngo_id: id,
                    zone_type: zone.zone_type,
                    name: zone.name,
                    parent_zone_id: deptMap[zone.parent_zone_id || ''] || null
                  })));

              if (muniError) throw muniError;
            }
          }
        }
      }
    }

    if (investments?.length) {
      const { data: currentInvestments } = await supabase
          .from('ngo_investments')
          .select('*')
          .eq('ngo_id', id);

      const currentInvestmentsString = JSON.stringify(currentInvestments?.sort((a, b) =>
          `${a.sector}${a.subsector}`.localeCompare(`${b.sector}${b.subsector}`)
      ));
      const newInvestmentsString = JSON.stringify(investments.map(investment => ({
        ...investment,
        ngo_id: id
      })).sort((a, b) =>
          `${a.sector}${a.subsector}`.localeCompare(`${b.sector}${b.subsector}`)
      ));

      if (currentInvestmentsString !== newInvestmentsString) {
        const { error: deleteError } = await supabase
            .from('ngo_investments')
            .delete()
            .eq('ngo_id', id);

        if (deleteError) throw deleteError;

        const { error: insertError } = await supabase
            .from('ngo_investments')
            .insert(investments.map(investment => ({
              ngo_id: id,
              investment_year: investment.investment_year,
              sector: investment.sector,
              subsector: investment.subsector,
              amount: investment.amount
            })));

        if (insertError) throw insertError;
      }
    }

    if (financial_resources?.length) {
      const { data: currentResources } = await supabase
          .from('ngo_financial_resources')
          .select('*')
          .eq('ngo_id', id);

      const currentResourcesString = JSON.stringify(currentResources?.sort((a, b) =>
          `${a.funding_type}${a.funding_source}`.localeCompare(`${b.funding_type}${b.funding_source}`)
      ));
      const newResourcesString = JSON.stringify(financial_resources.map(resource => ({
        ...resource,
        ngo_id: id
      })).sort((a, b) =>
          `${a.funding_type}${a.funding_source}`.localeCompare(`${b.funding_type}${b.funding_source}`)
      ));

      if (currentResourcesString !== newResourcesString) {
        const { error: deleteError } = await supabase
            .from('ngo_financial_resources')
            .delete()
            .eq('ngo_id', id);

        if (deleteError) throw deleteError;

        const { error: insertError } = await supabase
            .from('ngo_financial_resources')
            .insert(financial_resources.map(resource => ({
              ngo_id: id,
              funding_year: resource.funding_year,
              funding_type: resource.funding_type,
              funding_source: resource.funding_source,
              amount: resource.amount,
              details: resource.details
            })));

        if (insertError) throw insertError;
      }
    }

    if (beneficiaries?.length) {
      const { data: currentBeneficiaries } = await supabase
          .from('ngo_beneficiaries')
          .select('*')
          .eq('ngo_id', id);

      const currentBeneficiariesString = JSON.stringify(currentBeneficiaries?.sort((a, b) =>
          a.sector.localeCompare(b.sector)
      ));
      const newBeneficiariesString = JSON.stringify(beneficiaries.map(beneficiary => ({
        ...beneficiary,
        ngo_id: id
      })).sort((a, b) =>
          a.sector.localeCompare(b.sector)
      ));

      if (currentBeneficiariesString !== newBeneficiariesString) {
        const { error: deleteError } = await supabase
            .from('ngo_beneficiaries')
            .delete()
            .eq('ngo_id', id);

        if (deleteError) throw deleteError;

        const { error: insertError } = await supabase
            .from('ngo_beneficiaries')
            .insert(beneficiaries.map(beneficiary => ({
              ngo_id: id,
              sector: beneficiary.sector,
              total: beneficiary.total,
              men: beneficiary.men,
              women: beneficiary.women,
              young: beneficiary.young,
              pregnant_women: beneficiary.pregnant_women,
              lactating_women: beneficiary.lactating_women,
              teachers: beneficiary.teachers,
              students: beneficiary.students,
              legal_entities: beneficiary.legal_entities,
              child_before_preschool_age: beneficiary.child_before_preschool_age,
              preschool_age_child: beneficiary.preschool_age_child,
              school_age_child: beneficiary.school_age_child,
              disabled: beneficiary.disabled,
              other_vulnerable: beneficiary.other_vulnerable
            })));

        if (insertError) throw insertError;
      }
    }

      if (realizations?.length) {
          const { data: currentRealizations } = await supabase
              .from('ngo_realizations')
              .select('*')
              .eq('ngo_id', id);

          const currentRealizationsString = JSON.stringify(currentRealizations?.sort((a, b) =>
              a.sector.localeCompare(b.sector)
          ));
          const newRealizationsString = JSON.stringify(realizations.map(beneficiary => ({
              ...beneficiary,
              ngo_id: id
          })).sort((a, b) =>
              a.sector.localeCompare(b.sector)
          ));

          if (currentRealizationsString !== newRealizationsString) {
              const { error: deleteError } = await supabase
                  .from('ngo_realizations')
                  .delete()
                  .eq('ngo_id', id);

              if (deleteError) throw deleteError;

              const { error: insertError } = await supabase
                  .from('ngo_realizations')
                  .insert(realizations.map(realization => ({
                      ngo_id: id,
                      sector: realization.sector,
                      indicator: realization.indicator,
                      value: realization.value,
                  })));

              if (insertError) throw insertError;
          }
      }

      return getNGO(id);
  }catch (error) {
    console.error('Error in updateNGO:', error);
    throw error;
  }
}

export async function listBeneficiairies(ngoId?: string) {
  let query = supabase
      .from('ngo_beneficiaries')
      .select('*');

  if (ngoId) {
    query = query.eq('ngo_id', ngoId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function listActivities(ngoId?: string) {
  let query = supabase
    .from('ngo_activity_sectors')
    .select('*')
    .order('activity_year', { ascending: false });

  if (ngoId) {
    query = query.eq('ngo_id', ngoId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createActivity(data: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) {
  const { data: activity, error } = await supabase
    .from('activities')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return activity;
}

export async function updateActivity(id: string, data: Partial<Activity>) {
  const { data: activity, error } = await supabase
    .from('activities')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return activity;
}